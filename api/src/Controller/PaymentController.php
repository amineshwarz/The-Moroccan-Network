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
use App\Entity\Event;
use App\Entity\Ticket;

#[Route('/api/payment', name: 'api_payment_')]
class PaymentController extends AbstractController
{
// ---------ROUTE 1 : Initier un PAIEMENT D'ADHÉSION----------

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
        $baseUrl = 'https://exie-nonadjustable-overfastidiously.ngrok-free.dev'; //  URL Ngrok = tunnel temporaire pour exposer mon localhost sur internet

        $body = [
            'totalAmount' => (int)$data['amount'],
            'initialAmount' => (int)$data['amount'],
            'itemName' => "Adhésion Annuelle ({$data['type']}) - The Moroccan Network",
            'backUrl' => $baseUrl . '/adhesion', // Retourne à la page adhésion si annule
            'returnUrl' => $baseUrl . '/api/payment/success?type=membership', // Le ?type=membership permet de savoir quel type de paiement c'était
            'errorUrl' => $baseUrl . '/api/payment/error',
            'containsDonation' => false,
             // PRÉ-REMPLISSAGE DU FORMULAIRE HELLOASSO
            'payer' => [
                'firstName' => $data['firstName'],
                'lastName' => $data['lastName'],
                'email' => $data['email'],
            ],
            'metadata' => [
                'subscriber_id' => (string) $subscriber->getId() // C'est le lien entre HelloAsso et ma BDD ! Quand HelloAsso enverra le webhook de confirmation,
                // on récupérera cet ID pour retrouver et activer l'adhérent en BDD
            ]
        ];

        // 4. Appeler HelloAsso pour créer un checkout
        try {
            $checkoutData = $helloAsso->createCheckoutIntent($body);
            
            return $this->json([
                'redirectUrl' => $checkoutData['redirectUrl']
            ]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

// ------------------ ROUTE 2 : Redirection après SUCCÈS du paiement HelloAsso

    #[Route('/success', name: 'success', methods: ['GET'])]
    public function success(Request $request): Response
    {
        // On récupère le type (membership ou ticket) envoyé par HelloAsso
        $type = $request->query->get('type', 'default');
    
        // On renvoie l'utilisateur vers React en gardant ce paramètre
        return $this->redirect('http://localhost:5173/payment/success?type=' . $type);
    }

// ------------------ ROUTE 3 : Redirection après ERREUR ou ANNULATION du paiement
    #[Route('/error', name: 'error', methods: ['GET'])]
    public function error(): Response
    {
        return $this->redirect('http://localhost:5173/payment/cancel');
    }

    
// ------------------- ROUTE 4 : Initier un PAIEMENT DE BILLET D'ÉVÉNEMENT
    #[Route('/event/{id}/ticket', name: 'event_ticket_payment', methods: ['POST'])]
    public function initiateTicket(
        Event $event, 
        Request $request, 
        HelloAssoService $helloAsso, 
        EntityManagerInterface $em
    ): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);

            if (!$data) {
                return $this->json(['error' => 'Données de formulaire invalides'], 400);
            }

            // 1 — Créer le ticket en BDD avec statut PENDING
            $ticket = new Ticket();
            $ticket->setFirstName($data['firstName'] ?? 'Inconnu');
            $ticket->setLastName($data['lastName'] ?? 'Inconnu');
            $ticket->setEmail($data['email'] ?? '');
            $ticket->setCategory($data['category'] ?? 'STANDARD');
            $ticket->setAmount((int)($data['amount'] ?? 0));
            $ticket->setStatus('PENDING');
            $ticket->setEvent($event);

            $em->persist($ticket);
            $em->flush();

            // 2 — Construire le body pour HelloAsso
            $baseUrl = 'https://exie-nonadjustable-overfastidiously.ngrok-free.dev'; 

            $body = [
                'totalAmount' => (int)$data['amount'],
                'initialAmount' => (int)$data['amount'],
                'itemName' => "Billet : " . $event->getTitle() . " [" . ($data['category'] ?? 'ST') . "]",
                'backUrl' => $baseUrl . '/evenements/' . $event->getId(), 
                'returnUrl' => $baseUrl . '/api/payment/success?type=ticket', 
                'errorUrl' => $baseUrl . '/api/payment/error',
                'containsDonation' => false,
                'payer' => [
                    'firstName' => $data['firstName'] ?? 'Client',
                    'lastName' => $data['lastName'] ?? 'Inconnu',
                    'email' => $data['email'] ?? '',
                ],
                'metadata' => [
                    'ticket_id' => (string) $ticket->getId() 
                ]
            ];

            // 3 — Appel HelloAsso
            $checkoutData = $helloAsso->createCheckoutIntent($body);
            
            return $this->json(['redirectUrl' => $checkoutData['redirectUrl']]);

        } catch (\Exception $e) {
            // En renvoyant $e->getMessage(), tu verras l'erreur exacte dans ta console React
            return $this->json(['error' => 'Erreur HelloAsso : ' . $e->getMessage()], 500);
        }
    }
}