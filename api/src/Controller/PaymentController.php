<?php

namespace App\Controller;

use App\Entity\Subscriber;
use App\Service\HelloAssoService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/payment', name: 'api_payment_')]
class PaymentController extends AbstractController
{
    #[Route('/membership', name: 'membership', methods: ['POST'])]
    public function initiate(Request $request, HelloAssoService $helloAsso, EntityManagerInterface $em): JsonResponse
    {
        // 1. Récupérer les données envoyées par React
        $data = json_decode($request->getContent(), true);

        // 2. Créer l'adhérent en base de données avec le statut 'PENDING'
        $subscriber = new Subscriber();
        $subscriber->setFirstName($data['firstName']);
        $subscriber->setLastName($data['lastName']);
        $subscriber->setEmail($data['email']);
        $subscriber->setType($data['type']); // 'NORMAL' ou 'STUDENT'
        $subscriber->setAmount((int)$data['amount']); // ex: 3000 pour 30€
        $subscriber->setStatus('PENDING'); 

        $em->persist($subscriber);
        $em->flush(); 

        // 3. Préparer l'appel à HelloAsso
        // Remplace par ton adresse Ngrok actuelle pour les tests
        $baseUrl = 'https://exie-nonadjustable-overfastidiously.ngrok-free.dev'; 

        $body = [
            'totalAmount' => (int)$data['amount'],
            'initialAmount' => (int)$data['amount'],
            'itemName' => "Adhésion Annuelle ({$data['type']}) - The Moroccan Network",
            'backUrl' => $baseUrl . '/adhesion', // Retourne à la page adhésion si annule
            'returnUrl' => $baseUrl . '/api/payment/success',
            'errorUrl' => $baseUrl . '/api/payment/error',
            'containsDonation' => false,
            'metadata' => [
                'subscriber_id' => (string) $subscriber->getId() // Crucial pour le Webhook
            ]
        ];

        try {
            $checkoutData = $helloAsso->createCheckoutIntent($body);
            
            return $this->json([
                'redirectUrl' => $checkoutData['redirectUrl']
            ]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/success', name: 'success', methods: ['GET'])]
    public function success(): Response
    {
        // Une fois payé, on peut rediriger vers une belle page React
        return $this->redirect('http://localhost:5173/payment/success');
    }

    #[Route('/error', name: 'error', methods: ['GET'])]
    public function error(): Response
    {
        return $this->redirect('http://localhost:5173/payment/error');
    }
}