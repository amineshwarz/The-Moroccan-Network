<?php

namespace App\Service;

use App\Entity\Article;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

class ArticleManager
{
    public function __construct(
        private EntityManagerInterface $em,
        private string $imagesDirectory, // Configuré dans services.yaml
        private SluggerInterface $slugger // Outil Symfony pour les URLs
    ) {}

    /**
     * Sauvegarde ou met à jour un article
     */
    public function save(Article $article, array $data, ?UploadedFile $imageFile,  User $author): Article
    {
        // Si c'est une création, on lie l'auteur
        if ($article->getId() === null) {
            $article->setCreatedBy($author);
            $article->setCreatedAt(new \DateTimeImmutable());
        }

        $article->setTitle($data['title'] ?? 'Sans titre');
        $article->setContent($data['content'] ?? '');
        $article->setIsPublished($data['isPublished'] === '1' || $data['isPublished'] === true);
        
        // Initialisation de la date si c'est une création
        // if ($article->getCreatedAt() === null) {
        //     $article->setCreatedAt(new \DateTimeImmutable());
        // }

        // Génération du Slug (ex: "Bienvenue à tous" -> "bienvenue-a-tous")
        $article->setSlug($this->slugger->slug($article->getTitle())->lower());

        // Gestion de l'image (identique aux events)
        if ($imageFile) {
            $newFilename = uniqid().'.'.$imageFile->guessExtension();
            $imageFile->move($this->imagesDirectory . '/news', $newFilename);
            $article->setImage('/uploads/events/news/' . $newFilename);
        }

        $this->em->persist($article);
        $this->em->flush();

        return $article;
    }

    /**
     * Formate l'article pour le JSON de React
     */
    public function formatArticle(Article $article): array
    {
        return [
            'id' => $article->getId(),
            'title' => $article->getTitle(),
            'content' => $article->getContent(),
            'image' => $article->getImage(),
            'slug' => $article->getSlug(),
            'isPublished' => $article->isPublished(),
            'createdAt' => $article->getCreatedAt()->format('d/m/Y'),
        ];
    }
}