<?php

namespace KayStrobach\VisualSearch\Demands;

interface SimpleDemandInterface
{
    # public function __construct(
    #     \Neos\Flow\Persistence\Doctrine\Query $query,
    #     array $fields,
    #     array $selectorOptions
    # );

    /**
     * @param mixed $value
     * @return object
     */
    public function getDemands($value);
}
