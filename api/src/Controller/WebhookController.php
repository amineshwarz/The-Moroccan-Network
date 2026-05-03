<?php

namespace App\Controller;

use App\Repository\SubscriberRepository;
use App\Repository\TicketRepository; 
use App\Service\MailService;
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
        TicketRepository $ticketRepository, 
        EntityManagerInterface $em,
        MailService $mailService // On injecte le service de mail ici
    ): Response {
    // ----------------------------------ÉTAPE 1 — Lire le JSON envoyé par HelloAsso    
        try {
            $payload = $request->toArray();
        } catch (\Exception $e) {
            return new Response('Invalid JSON', 400);
        }

    // ----------------------------------ÉTAPE 2 — Extraire les métadonnées (le lien avec la BDD)   
    
        $metadata = $payload['metadata'] ?? [];
        
        // On récupère les deux IDs possibles (l'un sera null selon le type de paiement)
        $subscriberId = $metadata['subscriber_id'] ?? null;
        $ticketId = $metadata['ticket_id'] ?? null;

    // ----------------------------------ÉTAPE 3 — On ne traite l'activation que si l'événement est une commande validée ('Order')        
        if (isset($payload['eventType']) && $payload['eventType'] === 'Order') { // On entre UNIQUEMENT si c'est un 'Order'
            
        // --- CAS A : C'EST UNE ADHÉSION ANNUELLE ---
            if ($subscriberId) {
                $subscriber = $subscriberRepository->find((int)$subscriberId);

                // l'idempotence: DOUBLE VÉRIFICATION : getStatus() !== 'ACTIVE'
                // Pourquoi ? HelloAsso peut envoyer le MÊME webhook plusieurs fois
                if ($subscriber && $subscriber->getStatus() !== 'ACTIVE') {
                    // On passe le statut en ACTIVE
                    $subscriber->setStatus('ACTIVE');
                    
                    // On enregistre l'ID du payeur HelloAsso pour le suivi
                    $payerId = $payload['data']['payer']['id'] ?? null;
                    $subscriber->setHelloAssoPayerId((string)$payerId);

                    $em->flush();
                    
                    // ENVOI DU MAIL DE CONFIRMATION D'ADHÉSION
                    $mailService->sendMembershipConfirmation($subscriber);

                    // --- Log de debug dans webhooksuccess.log 
                    file_put_contents('webhook_success.log', "[" . date('Y-m-d H:i:s') . "] Adhérent $subscriberId activé et mail envoyé.\n", FILE_APPEND);
                }
            }

        // --- CAS B : C'EST UN TICKET POUR UN ÉVÉNEMENT ---
            if ($ticketId) {
                $ticket = $ticketRepository->find((int)$ticketId);

                if ($ticket && $ticket->getStatus() !== 'ACTIVE') {
                    
                    $ticket->setStatus('ACTIVE');
                    
                    // On stocke l'ID HelloAsso sur le ticket
                    if (method_exists($ticket, 'setHelloAssoPayerId')) {
                        $payerId = $payload['data']['payer']['id'] ?? null;
                        $ticket->setHelloAssoPayerId((string)$payerId);
                    }

                    $em->flush();

                    // --- ENVOI DU BILLET PAR EMAIL
                    $mailService->sendTicketConfirmation($ticket);

                    // --- Log de debug dans webhooksuccess.log 
                    file_put_contents('webhook_success.log', "[" . date('Y-m-d H:i:s') . "] Ticket $ticketId activé et mail envoyé.\n", FILE_APPEND);
                }
            }
        }

    // ----------------------------------ÉTAPE 4 — RÉPONSE OBLIGATOIRE 200 OK 
        // Si tu renvoies une erreur, ils retenteront l'appel 50 fois.
        return new Response('Webhook processed successfully', 200); // Le 200 dit à HelloAsso : "J'ai bien reçu, merci, ne réessaie pas"
    }
}