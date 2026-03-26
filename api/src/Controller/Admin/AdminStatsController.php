<?php

namespace App\Controller\Admin;

use App\Repository\SubscriberRepository;
use App\Repository\TicketRepository;
use App\Repository\EventRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/admin/stats')]
class AdminStatsController extends AbstractController
{
    #[Route('', name: 'admin_stats_index', methods: ['GET'])]
    public function getStats(
        SubscriberRepository $subRepo,
        TicketRepository $ticketRepo,
        EventRepository $eventRepo
    ): JsonResponse {
        
        // --- 1. CALCUL DES REVENUS (Identique) ---
        $caAdherents = $subRepo->createQueryBuilder('s')
            ->select('SUM(s.amount)')
            ->where('s.status = :status')->setParameter('status', 'ACTIVE')
            ->getQuery()->getSingleScalarResult() / 100;

        $caBillets = $ticketRepo->createQueryBuilder('t')
            ->select('SUM(t.amount)')
            ->where('t.status = :status')->setParameter('status', 'ACTIVE')
            ->getQuery()->getSingleScalarResult() / 100;

        // --- 2. LOGIQUE DU PROCHAIN ÉVÉNEMENT (Améliorée) ---
        $now = new \DateTimeImmutable();
        
        $nextEvent = $eventRepo->createQueryBuilder('e')
            ->where('e.date >= :now')      // On prend un événement futur
            ->andWhere('e.isPublished = :pub') // Il doit être publié
            ->setParameter('now', $now)
            ->setParameter('pub', true)
            ->orderBy('e.date', 'ASC')     // Le plus proche de nous
            ->setMaxResults(1)             // Un seul
            ->getQuery()
            ->getOneOrNullResult();

        $sold = 0;
        if ($nextEvent) {
            // On compte les tickets ACTIVE pour cet event précis
            $sold = count($ticketRepo->findBy(['event' => $nextEvent, 'status' => 'ACTIVE']));
        }

        return $this->json([
            'totals' => [
                'global' => $caAdherents + $caBillets,
                'membership' => $caAdherents,
                'ticketing' => $caBillets,
            ],
            'growth' => [
                'membership' => 12, // Exemples en dur pour l'instant
                'ticketing' => 25,
            ],
            'activeMembers' => count($subRepo->findBy(['status' => 'ACTIVE'])),
            'totalTickets' => count($ticketRepo->findBy(['status' => 'ACTIVE'])),
            'eventHealth' => [
                // Si pas d'event, on renvoie null pour que React affiche le message par défaut
                'title' => $nextEvent ? $nextEvent->getTitle() : null, 
                'sold' => $sold,
                'capacity' => $nextEvent ? $nextEvent->getCapacity() : 0,
            ]
        ]);
    }
}