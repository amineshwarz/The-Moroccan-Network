<?php

namespace App\Command;

use App\Entity\User; 
use Doctrine\ORM\EntityManagerInterface; 
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command; 
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface; 
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface; 

// On donne un nom à la commande. C'est ce qu'on tape : php bin/console app:create-admin
#[AsCommand(
    name: 'app:create-admin',
    description: 'Crée manuellement le tout premier compte administrateur du bureau.',
)]
class CreateAdminCommand extends Command
{
    // ----------Le constructeur permet de récupérer les outils de Symfony (Injection de dépendances)
    public function __construct(
        private EntityManagerInterface $entityManager,          // L'outil pour parler à MySQL
        private UserPasswordHasherInterface $passwordHasher     // L'outil pour crypter le mot de passe
    ) {        
        parent::__construct();      // On appelle le constructeur parent de Symfony
    }

    // ----------C'est ici que la logique s'exécute quand on lances la commande
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
        $user->setRoles(['ROLE_SUPER_ADMIN']);

        // 5. ON SÉCURISE LE MOT DE PASSE
        $plainPassword = 'aaaaaa'; 
        $hashedPassword = $this->passwordHasher->hashPassword($user, $plainPassword);
        
        // On donne ce mot de passe haché à l'utilisateur
        $user->setPassword($hashedPassword);

        // 6. ON ENREGISTRE DANS LA BASE DE DONNÉES
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // 7. On affiche un message de succès dans le terminal
        $output->writeln('<info>Succès : Le compte Admin (admin@test.com) a été créé !</info>');

        // On retourne un code 0 (SUCCESS) pour dire à Symfony que tout s'est bien passé
        return Command::SUCCESS;
    }
}