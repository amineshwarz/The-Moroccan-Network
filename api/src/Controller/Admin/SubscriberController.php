<?php

namespace App\Controller\Admin;

use App\Repository\SubscriberRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin/subscribers')]
// Seul l'ADMIN (Président ou Bras droit) a le droit de voir la liste des paiements
#[IsGranted('ROLE_ADMIN')]
class SubscriberController extends AbstractController
{
    #[Route('', name: 'admin_subscribers_list', methods: ['GET'])]
    public function list(SubscriberRepository $repository): JsonResponse
    {
        // On récupère tout le monde, du plus récent au plus ancien
        $subscribers = $repository->findBy([], ['id' => 'DESC']);
        
        $data = [];
        foreach ($subscribers as $s) {
            $data[] = [
                'id' => $s->getId(),
                'firstName' => $s->getFirstName(),
                'lastName' => $s->getLastName(),
                'email' => $s->getEmail(),
                'type' => $s->getType(), // NORMAL ou STUDENT
                'status' => $s->getStatus(), // ACTIVE ou PENDING
                'amount' => $s->getAmount() / 100, // On convertit les centimes en Euros
                'helloAssoId' => $s->getHelloAssoPayerId()
            ];
        }

        return $this->json($data);
    }
}