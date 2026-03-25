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
            'returnUrl' => $baseUrl . '/api/payment/success?type=membership', // On peut ajouter un paramètre pour différencier les types de paiement
            'errorUrl' => $baseUrl . '/api/payment/error',
            'containsDonation' => false,
            // --- AJOUT ICI : PRE-REMPLISSAGE HELLOASSO ---
            'payer' => [
                'firstName' => $data['firstName'],
                'lastName' => $data['lastName'],
                'email' => $data['email'],
            ],
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
    public function success(Request $request): Response
    {
        // On récupère le type (membership ou ticket) envoyé par HelloAsso
        $type = $request->query->get('type', 'default');
    
        // On renvoie l'utilisateur vers React en gardant ce paramètre
        return $this->redirect('http://localhost:5173/payment/success?type=' . $type);
    }

    #[Route('/error', name: 'error', methods: ['GET'])]
    public function error(): Response
    {
        return $this->redirect('http://localhost:5173/payment/cancel');
    }

    /**
     * Route pour initier l'achat d'un ticket pour un événement précis
     */
    #[Route('/event/{id}/ticket', name: 'event_ticket_payment', methods: ['POST'])]
    public function initiateTicket(
        Event $event, // Symfony récupère l'objet Event automatiquement via l'ID dans l'URL
        Request $request, 
        HelloAssoService $helloAsso, 
        EntityManagerInterface $em
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // 1. On crée le Ticket en base de données (Statut PENDING)
        $ticket = new Ticket();
        $ticket->setFirstName($data['firstName']);
        $ticket->setLastName($data['lastName']);
        $ticket->setEmail($data['email']);
        $ticket->setCategory($data['category']); // ex: "Tarif Adhérent"
        $ticket->setAmount((int)$data['amount']); // Montant en centimes
        $ticket->setStatus('PENDING');
        $ticket->setEvent($event); // On lie le ticket à l'événement

        $em->persist($ticket);
        $em->flush();

        // 2. Préparation de l'appel HelloAsso
        $baseUrl = 'https://exie-nonadjustable-overfastidiously.ngrok-free.dev'; 

        $body = [
            'totalAmount' => (int)$data['amount'],
            'initialAmount' => (int)$data['amount'],
            'itemName' => "Ticket : " . $event->getTitle() . " (" . $data['category'] . ")",
            'backUrl' => $baseUrl . '/evenements',
            'returnUrl' => $baseUrl . '/api/payment/success?type=ticket',
            'errorUrl' => $baseUrl . '/api/payment/error',
            'containsDonation' => false,
            'payer' => [
                'firstName' => $data['firstName'],
                'lastName' => $data['lastName'],
                'email' => $data['email'],
            ],
            'metadata' => [
                // C'EST ICI QU'ON DIT AU WEBHOOK QUE C'EST UN TICKET ET NON UNE ADHÉSION
                'ticket_id' => (string) $ticket->getId() 
            ]
        ];

        try {
            $checkoutData = $helloAsso->createCheckoutIntent($body);
            return $this->json(['redirectUrl' => $checkoutData['redirectUrl']]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }
}