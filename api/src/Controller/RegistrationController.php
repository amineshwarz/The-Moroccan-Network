<?php

// src/Controller/RegistrationController.php
namespace App\Controller;

use App\Entity\User;
use App\Repository\InvitationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class RegistrationController extends AbstractController
{
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request, 
        InvitationRepository $invitationRepo, 
        UserPasswordHasherInterface $hasher, 
        EntityManagerInterface $em
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $token = $data['token'] ?? '';

        // 1. Chercher l'invitation
        $invitation = $invitationRepo->findOneBy(['token' => $token, 'isUsed' => false]);

        if (!$invitation || $invitation->getExpiresAt() < new \DateTimeImmutable()) {
            return $this->json(['error' => 'Lien invalide ou expiré.'], 403);
        }

        // 2. Créer l'utilisateur
        $user = new User();
        $user->setEmail($invitation->getEmail()); // On impose l'email de l'invitation
        $user->setFirstName($data['firstName']);
        $user->setLastName($data['lastName']);
        $user->setRoles(['ROLE_USER']); // Il devient membre du bureau immédiatement

        $user->setPassword($hasher->hashPassword($user, $data['password']));

        // 3. Brûler l'invitation (Usage unique)
        $invitation->setIsUsed(true);

        $em->persist($user);
        $em->flush();

        return $this->json(['message' => 'Compte créé !'], 201);
    }
}