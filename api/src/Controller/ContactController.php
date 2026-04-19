<?php

namespace App\Controller;

use App\Service\MailService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class ContactController extends AbstractController
{
    #[Route('/api/contact', name: 'api_contact_send', methods: ['POST'])]
    public function send(Request $request, MailService $mailService): JsonResponse
    {
        // 1. On récupère les données de React
        $data = json_decode($request->getContent(), true);

        // 2. Petite validation de sécurité
        if (!$data || empty($data['email']) || empty($data['message'])) {
            return $this->json(['error' => 'Données incomplètes'], 400);
        }

        try {
            // 3. On utilise notre service centralisé
            $mailService->sendContactMessage($data);

            return $this->json(['message' => 'Votre message a été envoyé avec succès.']);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Erreur lors de l\'envoi : ' . $e->getMessage()], 500);
        }
    }
}