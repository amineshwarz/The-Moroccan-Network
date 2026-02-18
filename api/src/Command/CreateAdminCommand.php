<?php

// Le namespace indique où se trouve le fichier dans ton projet
namespace App\Command;

// On importe les outils nécessaires
use App\Entity\User; // Ton entité User pour créer l'objet
use Doctrine\ORM\EntityManagerInterface; // Pour enregistrer dans la base de données
use Symfony\Component\Console\Attribute\AsCommand; // Pour donner un nom à la commande
use Symfony\Component\Console\Command\Command; // La classe de base de Symfony
use Symfony\Component\Console\Input\InputInterface; // Pour gérer ce que tu tapes (facultatif ici)
use Symfony\Component\Console\Output\OutputInterface; // Pour afficher du texte dans le terminal
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface; // Pour sécuriser le mot de passe

// On donne un nom à la commande. C'est ce que tu taperas : php bin/console app:create-admin
#[AsCommand(
    name: 'app:create-admin',
    description: 'Crée manuellement le tout premier compte administrateur du bureau.',
)]
class CreateAdminCommand extends Command
{
    // Le constructeur permet de récupérer les outils de Symfony (Injection de dépendances)
    public function __construct(
        private EntityManagerInterface $entityManager, // L'outil pour parler à MySQL
        private UserPasswordHasherInterface $passwordHasher // L'outil pour crypter le mot de passe
    ) {
        // On appelle le constructeur parent de Symfony
        parent::__construct();
    }

    // C'est ici que la logique s'exécute quand tu lances la commande
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        // 1. On crée une nouvelle instance (un nouvel objet) de l'entité User
        $user = new User();

        // 2. On définit l'email (ton identifiant de connexion)
        $user->setEmail('admin@tmn.com');

        // 3. On définit le Prénom et le Nom
        $user->setFirstName('Admin');
        $user->setLastName('TMN');

        // 4. ON DÉFINIT LE RÔLE : C'est ici qu'on lui donne tous les pouvoirs
        // Dans Symfony, les rôles doivent toujours commencer par "ROLE_"
        $user->setRoles(['ROLE_SUPER_ADMIN']);

        // 5. ON SÉCURISE LE MOT DE PASSE
        // On ne doit JAMAIS stocker un mot de passe en clair (ex: "123456") dans la base.
        // Cette fonction transforme "aaaaaa" en une clé illisible (un "hash").
        $plainPassword = 'aaaaaa'; 
        $hashedPassword = $this->passwordHasher->hashPassword($user, $plainPassword);
        
        // On donne ce mot de passe haché à l'utilisateur
        $user->setPassword($hashedPassword);

        // 6. ON ENREGISTRE DANS LA BASE DE DONNÉES
        // "persist" dit à Doctrine : "Prépare-toi à ajouter cet objet"
        $this->entityManager->persist($user);

        // "flush" dit à Doctrine : "Exécute maintenant la requête SQL INSERT"
        $this->entityManager->flush();

        // 7. On affiche un message de succès dans le terminal
        $output->writeln('<info>Succès : Le compte Admin (admin@test.com) a été créé !</info>');

        // On retourne un code 0 (SUCCESS) pour dire à Symfony que tout s'est bien passé
        return Command::SUCCESS;
    }
}