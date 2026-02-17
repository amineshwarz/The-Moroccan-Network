<?php

namespace App\Controller\Admin;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin/users')]
#[IsGranted('ROLE_ADMIN')] // Seul l'Admin peut accéder à tout ce contrôleur
class UserManagementController extends AbstractController
{
    /**
     * Liste tous les membres du staff (User)
     */
    #[Route('/', name: 'admin_users_list', methods: ['GET'])]
    public function list(UserRepository $userRepository): JsonResponse
    {
        $users = $userRepository->findAll();
        $data = [];

        foreach ($users as $user) {
            $data[] = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'roles' => $user->getRoles(),
            ];
        }

        return $this->json($data);
    }

    /**
     * Modifier le rôle d'un utilisateur
     */
    #[Route('/{id}/role', name: 'admin_user_update_role', methods: ['PATCH'])]
    public function updateRole(User $user, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $newRole = $data['role'] ?? null;

        if (!$newRole || !in_array($newRole, ['ROLE_USER', 'ROLE_ADMIN'])) {
            return $this->json(['error' => 'Rôle invalide'], 400);
        }

        // On remplace les rôles (Symfony attend un tableau)
        $user->setRoles([$newRole]);
        $em->flush();

        return $this->json(['message' => 'Rôle mis à jour avec succès']);
    }
}