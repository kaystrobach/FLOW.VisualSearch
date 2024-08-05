<?php
namespace Poke\Search\Command;

/*
 * This file is part of the Happy.Coding package.
 */

use Poke\Search\Domain\Model\Pokemon;
use Poke\Search\Domain\Repository\PokemonRepository;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Cli\CommandController;

/**
 * @Flow\Scope("singleton")
 */
class PokemonImportCommandController extends CommandController
{
    /**
     * @Flow\Inject
     * @var PokemonRepository
     */
    protected $pokemonRepository;

    /**
     * An example command
     *
     * The comment of this command method is also used for Flow's help screens. The first line should give a very short
     * summary about what the command does. Then, after an empty line, you should explain in more detail what the command
     * does. You might also give some usage example.
     *
     * It is important to document the parameters with param tags, because that information will also appear in the help
     * screen.
     *
     * @param string $requiredArgument This argument is required
     * @param string $optionalArgument This argument is optional
     * @return void
     */
    public function exampleCommand($requiredArgument, $optionalArgument = null)
    {
        $this->outputLine('You called the example command and passed "%s" as the first argument.', array($requiredArgument));
    }

    public function importCommand($file = "pokemon.csv")
    {
        $this->outputLine('Importing Pokemon data');

        $handle = fopen($file, 'r');

        if (!$handle) {
            $this->outputLine('Error opening file');
            return;
        }

        $data = fgetcsv($handle);

        if (!$data) {
            $this->outputLine('Error parsing file');
            return;
        }

        $row = 0;
        while (($data = fgetcsv($handle)) !== false) {
            $row++;

            // $this->outputLine('Importing row %s', array($data));

            $pokemon = new Pokemon(
                (int) $data[0], // id
                (string) $data[1], // identifier
                (int) $data[2], // species_id
                (int) $data[3], // height
                (int) $data[4], // weight
                (int) $data[5], // base_experience
                (int) $data[6], // order
                (int) $data[7] // is_default
            );

            $this->pokemonRepository->add($pokemon);
        }

        fclose($handle);
    }
}
