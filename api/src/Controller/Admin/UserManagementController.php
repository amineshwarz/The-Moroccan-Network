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
// L'accès de base est autorisé pour ROLE_ADMIN (le Bras Droit) 
// car il doit pouvoir lister les membres.
#[IsGranted('ROLE_ADMIN')] 
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
     * Modifier le rôle d'un utilisateur avec protection hiérarchique
     */
    #[Route('/{id}/role', name: 'admin_user_update_role', methods: ['PATCH'])]
    public function updateRole(User $targetUser, Request $request, EntityManagerInterface $em): JsonResponse
    {
        // 1. On récupère l'utilisateur actuellement connecté (celui qui fait l'action)
        /** @var User $currentUser */
        $currentUser = $this->getUser();

        // 2. On récupère les données de la requête
        $data = json_decode($request->getContent(), true);
        $newRole = $data['role'] ?? null;

        // --- DÉBUT DE LA LOGIQUE DE SÉCURITÉ ---

        // A. VERROU PRÉSIDENTIEL : Un ROLE_ADMIN ne peut pas modifier un ROLE_SUPER_ADMIN
        // On vérifie si la cible est Super Admin ET si celui qui demande n'est PAS Super Admin
        if (in_array('ROLE_SUPER_ADMIN', $targetUser->getRoles()) && 
            !in_array('ROLE_SUPER_ADMIN', $currentUser->getRoles())) {
            return $this->json([
                'error' => 'Action interdite : Vous ne pouvez pas modifier les droits du Président.'
            ], 403); // 403 = Forbidden
        }

        // B. VERROU DE PROMOTION : Seul un Super Admin peut nommer un autre Super Admin
        if ($newRole === 'ROLE_SUPER_ADMIN' && !in_array('ROLE_SUPER_ADMIN', $currentUser->getRoles())) {
            return $this->json([
                'error' => 'Action interdite : Seul le Président peut nommer un autre Administrateur Suprême.'
            ], 403);
        }
        
        // --- FIN DE LA LOGIQUE DE SÉCURITÉ ---

        // Validation des rôles autorisés dans l'application
        $authorizedRoles = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'];
        if (!$newRole || !in_array($newRole, $authorizedRoles)) {
            return $this->json(['error' => 'Rôle invalide'], 400);
        }

        // Mise à jour en base de données
        $targetUser->setRoles([$newRole]);
        $em->flush();

        return $this->json([
            'message' => 'Le rôle de ' . $targetUser->getFirstName() . ' a été mis à jour.'
        ]);
    }
}