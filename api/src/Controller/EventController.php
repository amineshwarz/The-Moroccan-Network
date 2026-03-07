<?php

namespace App\Controller;

use App\Entity\Event;
use App\Repository\EventRepository;
use App\Service\EventManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/events')]
class EventController extends AbstractController
{
    public function __construct(
        private EventManager $eventManager,
        private EventRepository $eventRepository
    ) {}

    /**
     * PUBLIC : Liste des événements publiés
     */
    #[Route('/', name: 'event_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        // Si c'est un membre du staff, on lui montre tout (même non publiés)
        // Sinon, on ne montre que les événements publics
        if ($this->isGranted('ROLE_USER')) {
            $events = $this->eventRepository->findAll();
        } else {
            $events = $this->eventRepository->findBy(['isPublished' => true]);
        }

        $data = array_map(fn($e) => $this->eventManager->formatEvent($e), $events);
        return $this->json($data);
    }

    /**
     * STAFF : Créer un événement
     */
    #[Route('/create', name: 'event_create', methods: ['POST'])]
    #[IsGranted('ROLE_USER')] // Seul le staff peut créer
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $event = $this->eventManager->save(new Event(), $data);

        return $this->json([
            'message' => 'Événement créé avec succès',
            'event' => $this->eventManager->formatEvent($event)
        ], 201);
    }

    /**
     * STAFF : Modifier un événement
     */
    #[Route('/{id}/update', name: 'event_update', methods: ['PUT', 'PATCH'])]
    #[IsGranted('ROLE_USER')]
    public function update(Event $event, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $this->eventManager->save($event, $data);

        return $this->json(['message' => 'Événement mis à jour']);
    }

    /**
     * STAFF : Supprimer un événement
     */
    #[Route('/{id}', name: 'event_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    public function delete(Event $event): JsonResponse
    {
        $this->eventManager->delete($event);
        return $this->json(['message' => 'Événement supprimé']);
    }
}