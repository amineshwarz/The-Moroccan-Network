<?php

namespace App\Controller;

use App\Entity\Article;
use App\Repository\ArticleRepository;
use App\Service\ArticleManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/news')]
class ArticleController extends AbstractController
{
    public function __construct(
        private ArticleManager $articleManager,
        private ArticleRepository $articleRepo
    ) {}

    #[Route('', name: 'news_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        // Staff voit tout, Public voit que les publiés
        $articles = $this->isGranted('ROLE_USER') 
            ? $this->articleRepo->findBy([], ['createdAt' => 'DESC'])
            : $this->articleRepo->findBy(['isPublished' => true], ['createdAt' => 'DESC']);

        return $this->json(array_map(fn($a) => $this->articleManager->formatArticle($a), $articles));
    }

    #[Route('/create', name: 'news_create', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function create(Request $request): JsonResponse
    {
        $data = $request->request->all();
        $imageFile = $request->files->get('image');
        $article = $this->articleManager->save(new Article(), $data, $imageFile);
        return $this->json(['message' => 'Article créé'], 201);
    }

    /**
     * NOUVELLE ROUTE : MODIFICATION
     * Note: On utilise POST pour supporter l'upload d'image
     */
    #[Route('/{id}/update', name: 'news_update', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function update(Article $article, Request $request): JsonResponse
    {
        $data = $request->request->all();
        $imageFile = $request->files->get('image');
        $this->articleManager->save($article, $data, $imageFile);
        return $this->json(['message' => 'Article mis à jour']);
    }

    #[Route('/{id}', name: 'news_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    public function delete(Article $article, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($article);
        $em->flush();
        return $this->json(['message' => 'Article supprimé']);
    }
}