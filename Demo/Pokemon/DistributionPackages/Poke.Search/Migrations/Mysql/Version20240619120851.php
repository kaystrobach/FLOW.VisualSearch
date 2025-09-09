<?php

declare(strict_types=1);

namespace Neos\Flow\Persistence\Doctrine\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240619120851 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf(
            !$this->connection->getDatabasePlatform() instanceof \Doctrine\DBAL\Platforms\MySqlPlatform,
            "Migration can only be executed safely on '\Doctrine\DBAL\Platforms\MySqlPlatform'."
        );

        $this->addSql('ALTER TABLE poke_search_domain_model_pokemon ADD id INT NOT NULL, ADD species_id INT NOT NULL, ADD height INT NOT NULL, ADD weight INT NOT NULL, ADD base_experience INT NOT NULL, ADD `order` INT NOT NULL, ADD is_default INT NOT NULL, DROP national, DROP gen, CHANGE name identifier VARCHAR(255) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf(
            !$this->connection->getDatabasePlatform() instanceof \Doctrine\DBAL\Platforms\MySqlPlatform,
            "Migration can only be executed safely on '\Doctrine\DBAL\Platforms\MySqlPlatform'."
        );

        $this->addSql('ALTER TABLE poke_search_domain_model_pokemon ADD national INT NOT NULL, ADD gen INT NOT NULL, DROP id, DROP species_id, DROP height, DROP weight, DROP base_experience, DROP `order`, DROP is_default, CHANGE identifier name VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`');
    }
}
