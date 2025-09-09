<?php

namespace Poke\Search\Domain\Repository;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Persistence\Repository;
use KayStrobach\VisualSearch\Domain\Repository\SearchableRepository;

/**
 * @Flow\Scope("singleton")
 */
class PokemonRepository extends SearchableRepository
{
    /**
     * @var string
     */
    protected $defaultSearchName = 'pokemon';

    public function findByName(string $name)
    {
        $query = $this->createQuery();

        $query->matching($query->equals('name', $name));

        return $query->execute();
    }

    public function findByGen(int $gen)
    {
        $query = $this->createQuery();

        $query->matching($query->equals('gen', $gen));

        return $query->execute();
    }
}
