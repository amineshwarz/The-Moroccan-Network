<?php

namespace App\Service;

use App\Entity\User;
use App\Entity\Event;
use App\Entity\EventPrice;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class EventManager
{
    public function __construct(
        private EntityManagerInterface $em,
        private string $imagesDirectory // Injecté via services.yaml
    ) {}

    /**
     * Sauvegarde un événement avec gestion d'image et de prix
     */
    public function save(Event $event, array $data, ?UploadedFile $imageFile, User $author): Event
    {

        if ($event->getId() === null) {     // Assignation de l'auteur uniquement à la création
            $event->setCreatedBy($author);
        }

        // 1. Remplissage des données de base
        $event->setTitle($data['title']);
        $event->setDescription($data['description']);
        $event->setDate(new \DateTimeImmutable($data['date']));
        $event->setLocation($data['location']);
        $event->setCapacity((int)$data['capacity']);
        $event->setIsPublished($data['isPublished'] === '1' || $data['isPublished'] === true);

        // 2. GESTION DE L'IMAGE (Upload)
        if ($imageFile) {
            // Générer un nom unique pour éviter les doublons (ex: 65f32a.jpg)
            $newFilename = uniqid().'.'.$imageFile->guessExtension();

            // Déplacer le fichier dans le dossier public/uploads/events
            $imageFile->move($this->imagesDirectory, $newFilename);

            // Enregistrer le chemin relatif pour la base de données
            $event->setImage('/uploads/events/' . $newFilename);
        }

        // 3. GESTION DES PRIX
        // Comme on utilise FormData, React envoie les prix en chaîne JSON stringifiée
        $pricesData = is_string($data['prices']) ? json_decode($data['prices'], true) : $data['prices'];

        if ($event->getId() !== null) {
            foreach ($event->getEventPrices() as $oldPrice) {
                $event->removeEventPrice($oldPrice);
            }
        }

        if (isset($pricesData) && is_array($pricesData)) {
            foreach ($pricesData as $p) {
                $price = new EventPrice();
                $price->setCategory($p['category']);
                $price->setAmount((int)($p['amount'] * 100));
                $event->addEventPrice($price);
            }
        }

        $this->em->persist($event);
        $this->em->flush();

        return $event;
    }

    public function delete(Event $event): void
    {
        $this->em->remove($event);
        $this->em->flush();
    }

    public function formatEvent(Event $event): array
    {
        $prices = [];
        foreach ($event->getEventPrices() as $p) {
            $prices[] = ['category' => $p->getCategory(), 'amount' => $p->getAmount() / 100];
        }

        return [
            'id' => $event->getId(),
            'title' => $event->getTitle(),
            'description' => $event->getDescription(),
            'date' => $event->getDate()->format('c'),
            'location' => $event->getLocation(),
            'capacity' => $event->getCapacity(),
            'isPublished' => $event->isPublished(),
            'image' => $event->getImage(), // URL relative : /uploads/events/...
            'prices' => $prices
        ];
    }
}