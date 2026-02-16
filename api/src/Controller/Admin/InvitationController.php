<?php

namespace App\Controller\Admin;

use App\Entity\Invitation;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin/invitations', name: 'admin_invitation_')]
class InvitationController extends AbstractController
{
    /**
     * Cette fonction permet à l'ADMIN de générer un lien d'invitation
     */
    #[Route('/create', name: 'create', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')] // SEUL l'ADMIN peut accéder à cette route
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        // 1. On récupère les données envoyées par React (le JSON)
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;

        // Petite vérification de sécurité sur l'email
        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->json(['error' => 'Une adresse email valide est requise.'], 400);
        }

        // 2. GÉNÉRATION DU TOKEN (Le code secret de l'invitation)
        // bin2hex(random_bytes(32)) crée une chaîne aléatoire de 64 caractères
        $token = bin2hex(random_bytes(32));

        // 3. CRÉATION DE L'ENTITÉ INVITATION
        $invitation = new Invitation();
        $invitation->setEmail($email);
        $invitation->setToken($token);
        $invitation->setIsUsed(false); // Par défaut, elle n'est pas utilisée
        
        // On définit une date d'expiration (ex: dans 2 jours)
        $invitation->setExpiresAt(new \DateTimeImmutable('+2 days'));

        // 4. SAUVEGARDE DANS MYSQL
        $em->persist($invitation);
        $em->flush();

        // 5. CONSTRUCTION DU LIEN DE RETOUR
        // Ce lien pointe vers ta page d'inscription sur React
        // On y ajoute le token en paramètre d'URL (?token=...)
        $registrationLink = "http://localhost:5173/register?token=" . $token;

        // 6. RÉPONSE À REACT
        return $this->json([
            'message' => 'Invitation créée avec succès !',
            'link' => $registrationLink,
            'email' => $email
        ], 201);
    }
}