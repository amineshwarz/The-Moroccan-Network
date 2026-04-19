<?php

namespace App\Controller;

use App\Repository\SubscriberRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class MembershipCheckController extends AbstractController
{
    /**
     * Cette route est appelée par React pour vérifier le statut d'un visiteur
     * @param string $email L'email saisi dans le formulaire de billet
     */
    #[Route('/api/membership/check/{email}', name: 'api_membership_check', methods: ['GET'])]
    public function check(string $email, SubscriberRepository $repository): JsonResponse
    {
        // 1. On cherche l'adhérent dans la table Subscriber
        // On filtre uniquement ceux qui ont le statut 'ACTIVE' (paiement validé)
        $subscriber = $repository->findOneBy([
            'email' => $email,
            'status' => 'ACTIVE'
        ]);

        // 2. Si non trouvé, on renvoie un message clair mais pas d'erreur 500
        if (!$subscriber) {
            return $this->json([
                'isMember' => false,
                'message' => 'Aucune adhésion active trouvée pour cet email.'
            ], 200); // On renvoie 200 pour que React traite la réponse normalement
        }

        // 3. Si trouvé, on renvoie ses privilèges
        return $this->json([
            'isMember' => true,
            'type' => $subscriber->getType(), // 'NORMAL' ou 'STUDENT'
            'firstName' => $subscriber->getFirstName(),
            'lastName' => $subscriber->getLastName()
        ]);
    }
}