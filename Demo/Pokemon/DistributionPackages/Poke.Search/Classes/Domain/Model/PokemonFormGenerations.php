<?php

namespace Poke\Search\Domain\Model;

use Neos\Flow\Annotations as Flow;

/**
 * @Flow\Entity
 */
class PokemonFormGenerations {
    // pokemon_form_id,generation_id,game_index

    /**
     * @var int
     *
     */
    protected int $pokemon_form_id;

    /**
     * @var int
     */
    protected int $generation_id;

    /**
     * @var int
     */
    protected int $game_index;

    public function __construct(int $pokemon_form_id, int $generation_id, int $game_index)
    {
        $this->pokemon_form_id = $pokemon_form_id;
        $this->generation_id = $generation_id;
        $this->game_index = $game_index;
    }

    public function getPokemonFormId(): int
    {
        return $this->pokemon_form_id;
    }

    public function getGenerationId(): int
    {
        return $this->generation_id;
    }

    public function getGameIndex(): int
    {
        return $this->game_index;
    }
}
