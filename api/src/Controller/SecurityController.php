<?php

namespace App\Controller;

// 1. IMPORTATION CORRIGÉE : On utilise "Attribute" au lieu de "Annotation"
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route; 

class SecurityController extends AbstractController
{
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(): JsonResponse
    {
        // 2. RÉCUPÉRATION DE L'UTILISATEUR
        $user = $this->getUser();

        // Si aucun utilisateur n'est connecté (ne devrait pas arriver avec json_login bien configuré)
        if (!$user) {
            return $this->json(['error' => 'Identifiants invalides !!'], 401);
        }

        // 3. LA SOLUTION : On précise à l'éditeur que $user est une instance de notre classe User
        // Cela permet d'accéder à getFirstName() et getLastName() sans erreur
        /** @var User $user */
        
        return $this->json([
            'email' => $user->getUserIdentifier(),
            'roles' => $user->getRoles(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
        ]);
    }

    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(): void
    {
        // Cette partie est interceptée par Symfony (security.yaml) avant d'arriver ici.
        throw new \Exception('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }
}