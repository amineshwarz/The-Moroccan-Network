<?php

namespace App\Controller\Admin;

use App\Entity\Event;
use App\Repository\TicketRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin/events')]
#[IsGranted('ROLE_ADMIN')] // Seul l'admin accède aux listes nominatives
class AdminTicketController extends AbstractController
{
    /**
     * Récupère tous les tickets validés pour un événement précis
     */
    #[Route('/{id}/tickets', name: 'admin_event_tickets_list', methods: ['GET'])]
    public function getEventTickets(Event $event, TicketRepository $ticketRepo): JsonResponse
    {
        // On ne récupère que les tickets payés (ACTIVE)
        $tickets = $ticketRepo->findBy([
            'event' => $event,
            'status' => 'ACTIVE'
        ], ['id' => 'DESC']);

        $data = [
            'eventTitle' => $event->getTitle(),
            'capacity' => $event->getCapacity(),
            'ticketsSold' => count($tickets),
            'totalRevenue' => array_reduce($tickets, fn($carry, $t) => $carry + ($t->getAmount() / 100), 0),
            'participants' => array_map(fn($t) => [
                'id' => $t->getId(),
                'firstName' => $t->getFirstName(),
                'lastName' => $t->getLastName(),
                'email' => $t->getEmail(),
                'category' => $t->getCategory(),
                'amount' => $t->getAmount() / 100,
                'date' => $event->getDate()->format('d/m/Y')
            ], $tickets)
        ];

        return $this->json($data);
    }
}