<?php

namespace App\Controller;

use App\Repository\SubscriberRepository;
use App\Repository\TicketRepository; 
use App\Service\MailService; // On importe le nouveau service de mail
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
        
        try {
            // 1. On récupère les données JSON envoyées par HelloAsso
            $payload = $request->toArray();
        } catch (\Exception $e) {
            return new Response('Invalid JSON', 400);
        }

        // 2. On extrait les metadata (où on a caché nos IDs internes)
        $metadata = $payload['metadata'] ?? [];
        
        // On récupère les deux IDs possibles (l'un sera null selon le type de paiement)
        $subscriberId = $metadata['subscriber_id'] ?? null;
        $ticketId = $metadata['ticket_id'] ?? null;

        // 3. On ne traite l'activation que si l'événement est une commande validée ('Order')
        if (isset($payload['eventType']) && $payload['eventType'] === 'Order') {
            
            // --- CAS A : C'EST UNE ADHÉSION ANNUELLE ---
            if ($subscriberId) {
                $subscriber = $subscriberRepository->find((int)$subscriberId);

                // CHANGEMENT : On vérifie que le statut n'est PAS déjà ACTIVE
                // Pourquoi ? Pour éviter d'envoyer 2 fois le mail si HelloAsso renvoie le webhook
                if ($subscriber && $subscriber->getStatus() !== 'ACTIVE') {
                    // On passe le statut en ACTIVE
                    $subscriber->setStatus('ACTIVE');
                    
                    // On enregistre l'ID du payeur HelloAsso pour le suivi
                    $payerId = $payload['data']['payer']['id'] ?? null;
                    $subscriber->setHelloAssoPayerId((string)$payerId);

                    $em->flush();
                    
                    // --- NOUVEAU : ENVOI DU MAIL DE CONFIRMATION D'ADHÉSION ---
                    // On appelle la méthode de notre service pour envoyer le mail Twig
                    $mailService->sendMembershipConfirmation($subscriber);
                    
                    file_put_contents('webhook_success.log', "[" . date('Y-m-d H:i:s') . "] Adhérent $subscriberId activé et mail envoyé.\n", FILE_APPEND);
                }
            }

            // --- CAS B : C'EST UN TICKET POUR UN ÉVÉNEMENT ---
            if ($ticketId) {
                $ticket = $ticketRepository->find((int)$ticketId);

                // CHANGEMENT : On vérifie ici aussi que le statut n'est PAS déjà ACTIVE
                if ($ticket && $ticket->getStatus() !== 'ACTIVE') {
                    // On active le ticket pour qu'il soit valide à l'entrée
                    $ticket->setStatus('ACTIVE');
                    
                    // On stocke l'ID HelloAsso sur le ticket
                    if (method_exists($ticket, 'setHelloAssoPayerId')) {
                        $payerId = $payload['data']['payer']['id'] ?? null;
                        $ticket->setHelloAssoPayerId((string)$payerId);
                    }

                    $em->flush();

                    // --- NOUVEAU : ENVOI DU BILLET PAR EMAIL ---
                    // On envoie le mail avec les détails de l'événement (date, lieu, etc.)
                    $mailService->sendTicketConfirmation($ticket);
                    
                    file_put_contents('webhook_success.log', "[" . date('Y-m-d H:i:s') . "] Ticket $ticketId activé et mail envoyé.\n", FILE_APPEND);
                }
            }
        }

        // 4. RÉPONSE OBLIGATOIRE : Toujours répondre 200 à HelloAsso.
        // Si tu renvoies une erreur, ils retenteront l'appel 50 fois.
        return new Response('Webhook processed successfully', 200);
    }
}