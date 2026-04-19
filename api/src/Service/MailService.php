<?php

namespace App\Service;

use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use App\Entity\Subscriber;
use App\Entity\Ticket;

class MailService
{
    // On injecte le Mailer de Symfony
    public function __construct(private MailerInterface $mailer) {}

    /**
     * Mail pour inviter un nouveau membre du bureau (Staff)
     */
    public function sendStaffInvitation(string $emailRecipient, string $link): void
    {
        $email = (new TemplatedEmail())
            ->from('bureau@themoroccannetwork.org')
            ->to($emailRecipient)
            ->subject('Invitation : Rejoindre l\'équipe The Moroccan Network')
            // On pointe vers un fichier de design Twig
            ->htmlTemplate('emails/staff_invitation.html.twig')
            // On envoie les variables au fichier Twig
            ->context([
                'link' => $link,
            ]);

        $this->mailer->send($email);
    }

    /**
     * Mail pour confirmer l'achat d'un billet (Ticket)
     */
    public function sendTicketConfirmation(Ticket $ticket): void
    {
        $event = $ticket->getEvent();

        $email = (new TemplatedEmail())
            ->from('bureau@themoroccannetwork.org')
            ->to($ticket->getEmail())
            ->subject('Votre billet pour : ' . $event->getTitle())
            ->htmlTemplate('emails/ticket_confirmation.html.twig')
            ->context([
                'ticket' => $ticket,
                'event' => $event
            ]);

        $this->mailer->send($email);
    }
    /**
     * Mail pour confirmer une adhésion annuelle (Membership)
     */
    public function sendMembershipConfirmation(Subscriber $subscriber): void
    {
        $email = (new TemplatedEmail())
            ->from('bureau@themoroccannetwork.org')
            ->to($subscriber->getEmail())
            ->subject('Bienvenue parmi les adhérents TMN')
            ->htmlTemplate('emails/membership_confirmation.html.twig')
            ->context([
                'firstName' => $subscriber->getFirstName(),
                'type' => $subscriber->getType(),
                'amount' => $subscriber->getAmount() / 100
            ]);

        $this->mailer->send($email);
    }


    /**
     * Envoie le message du formulaire de contact au Bureau
     */
    public function sendContactMessage(array $contactData): void
    {
        $email = (new TemplatedEmail())
            // L'expéditeur technique (ton domaine)
            ->from('system@themoroccannetwork.org') 
            // L'adresse de l'association qui va recevoir le message
            ->to('bureau@themoroccannetwork.org') 
            // TRÈS IMPORTANT : On met l'email du visiteur en "Reply-To" 
            // pour que tu puisses lui répondre en cliquant simplement sur "Répondre"
            ->replyTo($contactData['email'])
            ->subject('NOUVEAU MESSAGE : ' . $contactData['subject'])
            ->htmlTemplate('emails/contact_form.html.twig')
            ->context([
                'name' => $contactData['name'],
                'visitorEmail' => $contactData['email'],
                'subject' => $contactData['subject'],
                'message' => $contactData['message'],
            ]);

        $this->mailer->send($email);
    }
}