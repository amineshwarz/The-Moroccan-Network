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
    /**
     * Injection du Service EventManager (pour la logique métier)
     * et du Repository (pour la lecture en base de données)
     */
    public function __construct(
        private EventManager $eventManager,
        private EventRepository $eventRepository
    ) {}

    /**
     * LISTER LES ÉVÉNEMENTS
     * Accessible par tout le monde (Public) et le Staff (Admin/Bureau)
     */
    #[Route('', name: 'event_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        // LOGIQUE : Si l'utilisateur est membre du staff (ROLE_USER ou plus),
        // on lui montre tout. Sinon, on filtre uniquement les événements publiés.
        if ($this->isGranted('ROLE_USER')) {
            $events = $this->eventRepository->findAll();
        } else {
            $events = $this->eventRepository->findBy(['isPublished' => true]);
        }

        // On utilise la fonction formatEvent de notre Service pour avoir un JSON propre
        $data = array_map(fn($e) => $this->eventManager->formatEvent($e), $events);
        
        return $this->json($data);
    }

    /**
     * CRÉER UN ÉVÉNEMENT
     * Reçoit un FormData contenant les textes et l'image (file)
     */
    #[Route('/create', name: 'event_create', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function create(Request $request): JsonResponse
    {
        // On récupère les données textuelles (title, description, etc.)
        $data = $request->request->all();
        
        // On récupère le fichier image s'il existe
        $imageFile = $request->files->get('image');

        try {
            // On délègue la création et l'upload au Service EventManager
            $event = $this->eventManager->save(new Event(), $data, $imageFile);

            return $this->json([
                'message' => 'Événement créé avec succès',
                'event' => $this->eventManager->formatEvent($event)
            ], 201);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * MODIFIER UN ÉVÉNEMENT
     * Note : On utilise POST car PHP ne gère pas nativement les fichiers (FormData) 
     * via les méthodes PUT ou PATCH sans configuration complexe.
     */
    #[Route('/{id}/update', name: 'event_update', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function update(Event $event, Request $request): JsonResponse
    {
        // Récupération des données modifiées
        $data = $request->request->all();
        $imageFile = $request->files->get('image');

        try {
            // Le service s'occupe de mettre à jour l'entité et de remplacer l'image
            $this->eventManager->save($event, $data, $imageFile);

            return $this->json(['message' => 'Événement mis à jour avec succès']);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * SUPPRIMER UN ÉVÉNEMENT
     */
    #[Route('/{id}', name: 'event_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    public function delete(Event $event): JsonResponse
    {
        // Le service gère la suppression (et le nettoyage des prix orphelins)
        $this->eventManager->delete($event);
        
        return $this->json(['message' => 'Événement supprimé avec succès']);
    }
}