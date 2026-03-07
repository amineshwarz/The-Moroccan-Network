<?php

namespace App\Service;

use App\Entity\Event;
use App\Entity\EventPrice;
use Doctrine\ORM\EntityManagerInterface;

class EventManager
{
    public function __construct(
        private EntityManagerInterface $em
    ) {}

    /**
     * Crée ou met à jour un événement
     */
    public function save(Event $event, array $data): Event
    {
        // 1. Infos de base
        $event->setTitle($data['title']);
        $event->setDescription($data['description']);
        $event->setDate(new \DateTimeImmutable($data['date']));
        $event->setLocation($data['location']);
        $event->setCapacity((int)$data['capacity']);
        $event->setIsPublished($data['isPublished'] ?? false);
        $event->setImage($data['image'] ?? null);

        // 2. Nettoyage des prix pour les mises à jour (Update)
        // On retire les anciens prix pour éviter les doublons
        if ($event->getId() !== null) {
            foreach ($event->getEventPrices() as $oldPrice) {
                $event->removeEventPrice($oldPrice);
            }
        }

        // 3. Ajout des nouveaux prix (Euros -> Centimes)
        if (isset($data['prices']) && is_array($data['prices'])) {
            foreach ($data['prices'] as $priceData) {
                $price = new EventPrice();
                $price->setCategory($priceData['category']);
                $price->setAmount((int)($priceData['amount'] * 100));
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

    /**
     * Formate un objet Event en tableau pour le JSON (Helper)
     */
    public function formatEvent(Event $event): array
    {
        $prices = [];
        foreach ($event->getEventPrices() as $p) {
            $prices[] = [
                'category' => $p->getCategory(),
                'amount' => $p->getAmount() / 100 // Centimes -> Euros
            ];
        }

        return [
            'id' => $event->getId(),
            'title' => $event->getTitle(),
            'description' => $event->getDescription(),
            'date' => $event->getDate()->format('c'), // Format ISO 8601 pour React
            'location' => $event->getLocation(),
            'capacity' => $event->getCapacity(),
            'isPublished' => $event->isPublished(),
            'image' => $event->getImage(),
            'prices' => $prices
        ];
    }
}