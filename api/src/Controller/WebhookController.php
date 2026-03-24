<?php

namespace App\Controller;

use App\Repository\SubscriberRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class WebhookController extends AbstractController
{
    #[Route('/api/webhook/helloasso', name: 'helloasso_webhook', methods: ['POST'])]
    public function handleHelloAsso(
        Request $request, 
        SubscriberRepository $subscriberRepository, 
        EntityManagerInterface $em
    ): Response {
        
        try {
            $payload = $request->toArray();
        } catch (\Exception $e) {
            return new Response('Invalid JSON', 400);
        }

        // Récupération de l'ID qu'on a mis dans les metadata lors du paiement
        $subscriberId = $payload['metadata']['subscriber_id'] ?? null;

        if (isset($payload['eventType']) && $payload['eventType'] === 'Order') {
            
            if ($subscriberId) {
                $subscriber = $subscriberRepository->find((int)$subscriberId);

                if ($subscriber) {
                    // On active l'adhérent
                    $subscriber->setStatus('ACTIVE');
                    
                    // On récupère l'ID du payeur chez HelloAsso
                    $payerId = $payload['data']['payer']['id'] ?? null;
                    $subscriber->setHelloAssoPayerId((string)$payerId);

                    $em->flush();
                    
                    file_put_contents('webhook_success.log', "[" . date('Y-m-d H:i:s') . "] Adhérent $subscriberId activé.\n", FILE_APPEND);
                }
            }
        }

        // On répond 200 à HelloAsso
        return new Response('OK', 200);
    }
}