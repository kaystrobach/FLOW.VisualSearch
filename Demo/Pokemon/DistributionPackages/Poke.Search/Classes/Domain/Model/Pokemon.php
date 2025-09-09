<?php

namespace Poke\Search\Domain\Model;

use Neos\Flow\Annotations as Flow;
use Doctrine\ORM\Mapping\Column;

/**
 * @Flow\Entity
 */
class Pokemon
{
    /**
     * @var int
     */
    protected int $id;

    /**
     * @var string
     */
    protected string $identifier;

    /**
     * @var int
     */
    protected int $species_id;

    /**
     * @var int
     */
    protected int $height;

    /**
     * @var int
     */
    protected int $weight;

    /**
     * @var int
     */
    protected int $base_experience;

    /**
     * @var int
     * @Doctrine\ORM\Mapping\Column(name="`order`")
     */
    protected int $order;

    /**
     * @var int
     */
    protected int $is_default;

    public function __construct(int $id, string $identifier, int $species_id, int $height, int $weight, int $base_experience, int $order, int $is_default)
    {
        $this->id = $id;
        $this->identifier = $identifier;
        $this->species_id = $species_id;
        $this->height = $height;
        $this->weight = $weight;
        $this->base_experience = $base_experience;
        $this->order = $order;
        $this->is_default = $is_default;
    }

    public function __toString()
    {
        return $this->identifier;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getIdentifier(): string
    {
        return $this->identifier;
    }

    public function getSpeciesId(): int
    {
        return $this->species_id;
    }

    public function getHeight(): int
    {
        return $this->height;
    }

    public function getWeight(): int
    {
        return $this->weight;
    }

    public function getBaseExperience(): int
    {
        return $this->base_experience;
    }

    public function getOrder(): int
    {
        return $this->order;
    }

    public function getIsDefault(): int
    {
        return $this->is_default;
    }

    public function getSprite()
    {
        return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" . $this->getId() . ".png";
    }

    public function getCry()
    {
        return "https://raw.githubusercontent.com/PokeAPI/cries/master/cries/pokemon/latest/" . $this->getId() . ".ogg";
    }
}
