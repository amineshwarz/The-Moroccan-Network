<?php

namespace App\Controller\Public;

use App\Repository\SubscriberRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class MembershipCheckController extends AbstractController
{
    #[Route('/api/membership/check/{email}', name: 'api_membership_check', methods: ['GET'])]
    public function check(string $email, SubscriberRepository $repository): JsonResponse
    {
        // On cherche un adhérent avec le statut ACTIVE uniquement
        $subscriber = $repository->findOneBy([
            'email' => $email,
            'status' => 'ACTIVE'
        ]);

        if (!$subscriber) {
            return $this->json(['isMember' => false], 404);
        }

        return $this->json([
            'isMember' => true,
            'type' => $subscriber->getType(), // NORMAL ou STUDENT
            'firstName' => $subscriber->getFirstName()
        ]);
    }
}