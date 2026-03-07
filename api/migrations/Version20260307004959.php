<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260307004959 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE event (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, date DATETIME NOT NULL, location VARCHAR(255) NOT NULL, capacity INT NOT NULL, image VARCHAR(255) DEFAULT NULL, is_published TINYINT NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE event_price (id INT AUTO_INCREMENT NOT NULL, category VARCHAR(255) NOT NULL, amount INT NOT NULL, event_id INT DEFAULT NULL, INDEX IDX_8BD393F571F7E88B (event_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE event_price ADD CONSTRAINT FK_8BD393F571F7E88B FOREIGN KEY (event_id) REFERENCES event (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE event_price DROP FOREIGN KEY FK_8BD393F571F7E88B');
        $this->addSql('DROP TABLE event');
        $this->addSql('DROP TABLE event_price');
    }
}
