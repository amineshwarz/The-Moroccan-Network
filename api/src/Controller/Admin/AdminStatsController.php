<?php

namespace App\Controller\Admin;

use App\Repository\SubscriberRepository;
use App\Repository\TicketRepository;
use App\Repository\EventRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin/stats')]
#[IsGranted('ROLE_ADMIN')]
class AdminStatsController extends AbstractController
{
    #[Route('', name: 'admin_stats_index', methods: ['GET'])]
    public function getStats(
        SubscriberRepository $subRepo,
        TicketRepository $ticketRepo,
        EventRepository $eventRepo
    ): JsonResponse {
        $now = new \DateTimeImmutable();
        $firstDayMonth = $now->modify('first day of this month')->setTime(0, 0);
        $firstDayLastMonth = $now->modify('first day of last month')->setTime(0, 0);

        // --- 1. CALCULS CHIFFRE D'AFFAIRES (CA) ---
        $caAdherents = (float)$subRepo->createQueryBuilder('s')
            ->select('SUM(s.amount)')
            ->where('s.status = :status')->setParameter('status', 'ACTIVE')
            ->getQuery()->getSingleScalarResult() / 100;

        $caBillets = (float)$ticketRepo->createQueryBuilder('t')
            ->select('SUM(t.amount)')
            ->where('t.status = :status')->setParameter('status', 'ACTIVE')
            ->getQuery()->getSingleScalarResult() / 100;

        // --- 2. CALCUL CROISSANCE (Mois en cours vs Mois dernier) ---
        // On compte les nouveaux inscrits ce mois-ci
        $newSubsThisMonth = count($subRepo->createQueryBuilder('s')
            ->where('s.status = :status')->setParameter('status', 'ACTIVE')
            // ->andWhere('s.createdAt >= :start')->setParameter('start', $firstDayMonth) 
            ->getQuery()->getResult());

        // --- 3. PROCHAIN ÉVÉNEMENT ---
        $nextEvent = $eventRepo->createQueryBuilder('e')
            ->where('e.date >= :now')->setParameter('now', $now)
            ->andWhere('e.isPublished = :pub')->setParameter('pub', true)
            ->orderBy('e.date', 'ASC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();

        $sold = $nextEvent ? count($ticketRepo->findBy(['event' => $nextEvent, 'status' => 'ACTIVE'])) : 0;

        return $this->json([
            'totals' => [
                'global' => $caAdherents + $caBillets,
                'membership' => $caAdherents,
                'ticketing' => $caBillets,
            ],
            'growth' => [
                'membership' => 12.5, // À lier à une vraie logique de calcul historique
                'ticketing' => 8.2,
            ],
            'activeMembers' => count($subRepo->findBy(['status' => 'ACTIVE'])),
            'totalTickets' => count($ticketRepo->findBy(['status' => 'ACTIVE'])),
            'eventHealth' => [
                'id' => $nextEvent ? $nextEvent->getId() : null,
                'title' => $nextEvent ? $nextEvent->getTitle() : null,
                'sold' => $sold,
                'capacity' => $nextEvent ? $nextEvent->getCapacity() : 0,
            ]
        ]);
    }
}