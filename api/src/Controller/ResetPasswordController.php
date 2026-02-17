<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route('/api/forgot-password')]
class ResetPasswordController extends AbstractController
{
    // ÉTAPE 1 : L'utilisateur demande un lien par email
    #[Route('/request', name: 'api_forgot_password_request', methods: ['POST'])]
    public function request(Request $request, UserRepository $userRepo, MailerInterface $mailer, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $userRepo->findOneBy(['email' => $data['email']]);

        // Sécurité Pro : Même si l'utilisateur n'existe pas, on répond "Email envoyé" 
        // pour ne pas donner d'indice aux pirates (Account Enumeration)
        if ($user) {
            $token = bin2hex(random_bytes(32));
            $user->setResetToken($token);
            $user->setResetTokenExpiresAt(new \DateTimeImmutable('+1 hour'));
            $em->flush();

            // Envoi du mail (comme pour l'invitation)
            $link = "http://localhost:5173/forgot-password?token=" . $token;
            $email = (new Email())
                ->from('bureau@moroccan4life.org')
                ->to($user->getEmail())
                ->subject('Réinitialisation de votre mot de passe')
                ->html("Cliquez ici pour changer votre mot de passe : <a href='$link'>Changer mon mot de passe</a>");
            
            $mailer->send($email);
        }

        return $this->json(['message' => 'Si cet email existe, un lien a été envoyé.']);
    }

    // ÉTAPE 2 : L'utilisateur utilise le lien reçu pour changer son mot de passe
    #[Route('/reset', name: 'api_forgot_password_reset', methods: ['POST'])]
    public function reset(Request $request, UserRepository $userRepo, UserPasswordHasherInterface $hasher, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $userRepo->findOneBy(['resetToken' => $data['token']]);

        // Vérification du token et de l'expiration
        if (!$user || $user->getResetTokenExpiresAt() < new \DateTimeImmutable()) {
            return $this->json(['error' => 'Lien invalide ou expiré'], 400);
        }

        // Changement du mot de passe
        $user->setPassword($hasher->hashPassword($user, $data['password']));
        
        // IMPORTANT : On efface le token pour qu'il ne serve plus
        $user->setResetToken(null);
        $user->setResetTokenExpiresAt(null);
        
        $em->flush();

        return $this->json(['message' => 'Mot de passe modifié avec succès !']);
    }
}