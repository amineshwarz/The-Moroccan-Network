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
     * LISTER LES ÉVÉNEMENTS
     * Public : Uniquement les publiés / Staff : Tout le catalogue
     */
    #[Route('', name: 'event_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        if ($this->isGranted('ROLE_USER')) {
            $events = $this->eventRepository->findAll();
        } else {
            $events = $this->eventRepository->findBy(['isPublished' => true]);
        }

        $data = array_map(fn($e) => $this->eventManager->formatEvent($e), $events);
        return $this->json($data);
    }

    /**
     * CRÉER UN ÉVÉNEMENT
     * Reçoit un FormData (Multipart) pour supporter l'upload d'image
     */
    #[Route('/create', name: 'event_create', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function create(Request $request): JsonResponse
    {
        // On récupère toutes les données textuelles du formulaire
        $data = $request->request->all();
        
        // --- DIAGNOSTIC SÉCURITÉ ---
        // Si $data est vide alors que React a envoyé des données, 
        // c'est que le fichier est trop gros pour la configuration PHP actuelle.
        if (empty($data)) {
            return $this->json([
                'error' => 'Le serveur a reçu un formulaire vide. Vérifiez la taille de votre image (Max 10Mo par défaut sur PHP).'
            ], 400);
        }

        // On récupère le fichier binaire de l'image
        $imageFile = $request->files->get('image');

        try {
            // On passe l'entité neuve, les données et l'image au service de gestion
            $event = $this->eventManager->save(new Event(), $data, $imageFile);

            return $this->json([
                'message' => 'Événement créé avec succès',
                'event' => $this->eventManager->formatEvent($event)
            ], 201);
        } catch (\Exception $e) {
            // Renvoie l'erreur précise (ex: format de date invalide)
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * MODIFIER UN ÉVÉNEMENT
     * Note : On utilise POST même pour l'update car PHP ne gère pas nativement 
     * les fichiers en méthode PUT ou PATCH via FormData.
     */
    #[Route('/{id}/update', name: 'event_update', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function update(Event $event, Request $request): JsonResponse
    {
        $data = $request->request->all();
        $imageFile = $request->files->get('image');

        if (empty($data)) {
            return $this->json(['error' => 'Données manquantes ou fichier trop volumineux.'], 400);
        }

        try {
            $this->eventManager->save($event, $data, $imageFile);
            return $this->json(['message' => 'Événement mis à jour avec succès']);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * SUPPRIMER UN ÉVÉNEMENT
     * Supprime l'entrée et nettoie les prix orphelins (via orphanRemoval: true)!
     */
    #[Route('/{id}', name: 'event_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    public function delete(Event $event): JsonResponse
    {
        $this->eventManager->delete($event);
        return $this->json(['message' => 'Événement supprimé avec succès']);
    }
}