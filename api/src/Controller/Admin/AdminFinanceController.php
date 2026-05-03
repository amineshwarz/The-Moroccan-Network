<?php

namespace App\Controller\Admin;

use App\Repository\SubscriberRepository;
use App\Repository\TicketRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin/finance')]
#[IsGranted('ROLE_ADMIN')]
class AdminFinanceController extends AbstractController
{
    #[Route('/transactions', name: 'admin_finance_transactions', methods: ['GET'])]
    public function getTransactions(SubscriberRepository $subRepo, TicketRepository $ticketRepo): JsonResponse
    {
        // 1. Récupérer les Adhésions Actives
        $memberships = $subRepo->findBy(['status' => 'ACTIVE']);
        $membersData = array_map(fn($s) => [
            'id' => 'SUB-' . $s->getId(),
            'date' => 'Février 2024', //  utilise un champ createdAt
            'label' => "Adhésion Annuelle : " . $s->getFirstName() . " " . $s->getLastName(),
            'category' => 'ADHESION',
            'amount' => $s->getAmount() / 100,
            'email' => $s->getEmail()
        ], $memberships);

        // 2. Récupérer les Billets Actifs
        $tickets = $ticketRepo->findBy(['status' => 'ACTIVE']);
        $ticketsData = array_map(fn($t) => [
            'id' => 'TIC-' . $t->getId(),
            'date' => 'Février 2024', 
            'label' => "Billet " . $t->getEvent()->getTitle() . " : " . $t->getFirstName(),
            'category' => 'BILLETTERIE',
            'amount' => $t->getAmount() / 100,
            'email' => $t->getEmail()
        ], $tickets);

        // 3. Fusionner et Trier (du plus récent au plus ancien)
        $allTransactions = array_merge($membersData, $ticketsData);
        usort($allTransactions, fn($a, $b) => $b['id'] <=> $a['id']);

        return $this->json([
            'totalBalance' => array_reduce($allTransactions, fn($sum, $t) => $sum + $t['amount'], 0),
            'transactions' => $allTransactions
        ]);
    }
}