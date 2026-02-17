<?php

namespace App\Controller\Admin;

use App\Entity\Invitation;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

// --- IMPORTATIONS NÉCESSAIRES POUR LE MAIL ---
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

#[Route('/api/admin/invitations', name: 'admin_invitation_')]
class InvitationController extends AbstractController
{
    /**
     * Cette fonction permet à l'ADMIN de générer un lien d'invitation ET d'envoyer un mail.
     */
    #[Route('/create', name: 'create', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')] 
    public function create(
        Request $request, 
        EntityManagerInterface $em, 
        MailerInterface $mailer // Injection du service Mailer de Symfony
    ): JsonResponse {
        
        // 1. RÉCUPÉRATION ET VALIDATION DES DONNÉES
        $data = json_decode($request->getContent(), true);
        $emailRecipient = $data['email'] ?? null;

        if (!$emailRecipient || !filter_var($emailRecipient, FILTER_VALIDATE_EMAIL)) {
            return $this->json(['error' => 'Une adresse email valide est requise.'], 400);
        }

        // 2. GÉNÉRATION DU TOKEN UNIQUE (64 caractères aléatoires)
        $token = bin2hex(random_bytes(32));

        // 3. CRÉATION ET SAUVEGARDE DE L'INVITATION DANS MYSQL
        $invitation = new Invitation();
        $invitation->setEmail($emailRecipient);
        $invitation->setToken($token);
        $invitation->setIsUsed(false);
        $invitation->setExpiresAt(new \DateTimeImmutable('+2 days'));

        $em->persist($invitation);
        $em->flush(); // On enregistre en base avant d'envoyer le mail

        // 4. CONSTRUCTION DU LIEN VERS TON REACT
        $link = "http://localhost:5173/register?token=" . $token;

        // 5. CRÉATION DU MESSAGE EMAIL
        // On utilise tes couleurs : Coquelicot (#ff3300) et Black Bean (#330000)
        $email = (new Email())
            ->from('bureau@themoroccannetwork.org') // L'expéditeur affiché
            ->to($emailRecipient)              // Le destinataire (ton futur membre)
            ->subject('Invitation : Rejoindre l\'équipe The Moroccan Network')
            ->html("
                <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ffddcc; border-radius: 15px; overflow: hidden;'>
                    <div style='background-color: #330000; padding: 20px; text-align: center;'>
                        <h1 style='color: #ff3300; margin: 0;'>Moroccan 4 Life</h1>
                    </div>
                    <div style='padding: 30px; color: #330000; line-height: 1.6;'>
                        <h2 style='color: #ff3300;'>Bienvenue dans l'équipe !</h2>
                        <p>Bonjour,</p>
                        <p>Vous avez été invité par l'administrateur à rejoindre le <strong>bureau de l'association</strong>.</p>
                        <p>Pour finaliser la création de votre compte et accéder à votre espace de gestion, cliquez sur le bouton ci-dessous :</p>
                        
                        <div style='text-align: center; margin: 40px 0;'>
                            <a href='$link' style='background-color: #ff3300; color: white; padding: 15px 25px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;'>
                                Activer mon accès bureau
                            </a>
                        </div>
                        
                        <p style='font-size: 0.9em; color: #666;'>
                            Attention : Ce lien est strictement personnel et expirera dans 48 heures.
                        </p>
                    </div>
                    <div style='background-color: #f8f8f8; padding: 15px; text-align: center; font-size: 0.8em; color: #999;'>
                        &copy; 2024 Moroccan 4 Life - Service Administration
                    </div>
                </div>
            ");

        // 6. ENVOI DE L'EMAIL AVEC GESTION D'ERREUR
        try {
            $mailer->send($email); // Symfony utilise ici ton MAILER_DSN (Mailtrap)
            
            return $this->json([
                'message' => 'Invitation créée et envoyée avec succès à ' . $emailRecipient,
                'link' => $link, // On le renvoie au front au cas où l'admin veuille le copier manuellement
            ], 201);

        } catch (\Exception $e) {
            // Si le serveur mail (Mailtrap) est injoignable, on renvoie une erreur
            return $this->json([
                'error' => 'L\'invitation est créée en base, mais le mail n\'a pas pu être envoyé.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}