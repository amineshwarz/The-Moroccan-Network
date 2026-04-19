<?php

namespace App\Controller\Admin;

use App\Entity\Invitation;
use App\Service\MailService; // On importe ton nouveau service
use App\Repository\InvitationRepository;
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
     * Crée une invitation et délègue l'envoi du mail au MailService
     */
    #[Route('/create', name: 'create', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')] 
    public function create(
        Request $request, 
        EntityManagerInterface $em, 
        MailService $mailService // Injection de ton service personnalisé
    ): JsonResponse {
        
        $data = json_decode($request->getContent(), true);
        $emailRecipient = $data['email'] ?? null;

        if (!$emailRecipient || !filter_var($emailRecipient, FILTER_VALIDATE_EMAIL)) {
            return $this->json(['error' => 'Une adresse email valide est requise.'], 400);
        }

        // 1. Logique métier : Création de l'entité et du Token
        $token = bin2hex(random_bytes(32));
        $invitation = new Invitation();
        $invitation->setEmail($emailRecipient);
        $invitation->setToken($token);
        $invitation->setIsUsed(false);
        $invitation->setExpiresAt(new \DateTimeImmutable('+2 days'));

        $em->persist($invitation);
        $em->flush(); 

        $link = "http://localhost:5173/register?token=" . $token;

        // 2. Délégation : On demande au service d'envoyer le mail
        try {
            $mailService->sendStaffInvitation($emailRecipient, $link);
            
            return $this->json([
                'message' => 'Invitation créée et envoyée avec succès !',
                'link' => $link,
                'email' => $emailRecipient,
            ], 201);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Invitation créée mais l\'envoi du mail a échoué.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('', name: 'admin_invitation_list', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function list(InvitationRepository $invitationRepo): JsonResponse
    {
        $invitations = $invitationRepo->findBy([], ['id' => 'DESC']);
        
        $data = array_map(fn($i) => [
            'id' => $i->getId(),
            'email' => $i->getEmail(),
            'token' => $i->getToken(),
            'isUsed' => $i->isUsed(),
            'expiresAt' => $i->getExpiresAt()->format('d/m/Y H:i'),
            'isValid' => $i->getExpiresAt() > new \DateTimeImmutable() && !$i->isUsed()
        ], $invitations);

        return $this->json($data);
    }

    #[Route('/{id}', name: 'admin_invitation_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(Invitation $invitation, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($invitation);
        $em->flush();
        return $this->json(['message' => 'Invitation révoquée.']);
    }
}