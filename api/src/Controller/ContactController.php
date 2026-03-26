<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Attribute\Route;

class ContactController extends AbstractController
{
    #[Route('/api/contact', name: 'api_contact_send', methods: ['POST'])]
    public function send(Request $request, MailerInterface $mailer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // On construit l'email que TU vas recevoir
        $email = (new Email())
            ->from('systeme@themoroccannetwork.org')
            ->to('ton-email-admin@gmail.com') // TON EMAIL ICI
            ->replyTo($data['email'])
            ->subject('NOUVEAU MESSAGE : ' . $data['subject'])
            ->html("
                <h1>Nouveau message de {$data['name']}</h1>
                <p><strong>Email :</strong> {$data['email']}</p>
                <p><strong>Message :</strong></p>
                <p>{$data['message']}</p>
            ");

        $mailer->send($email);

        return $this->json(['message' => 'Email envoyé avec succès']);
    }
}