<?php

namespace App\EventListener;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\Security\Core\User\UserInterface;

class AuthenticationSuccessListener
{
    /**
     * Cette méthode est appelée automatiquement par LexikJWT quand le login est correct
     */
    public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event): void
    {
        $data = $event->getData();
        $user = $event->getUser();

        // On vérifie que l'utilisateur est bien une instance de notre classe User
        if (!$user instanceof User) {
            return;
        }

        // On ajoute une clé "user" dans le JSON de réponse
        // C'est cet objet que ton React attend dans login(data.user, data.token)
        $data['user'] = [
            'email'     => $user->getUserIdentifier(),
            'roles'     => $user->getRoles(),
            'firstName' => $user->getFirstName(),
            'lastName'  => $user->getLastName(),
        ];

        // On renvoie les données modifiées
        $event->setData($data);
    }
}