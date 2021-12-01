<?php

namespace KayStrobach\VisualSearch\Demands;

use Neos\Flow\Persistence\Doctrine\Query;

abstract class AbstractDemand implements SimpleDemandInterface
{
    /**
     * @var Query
     */
    protected $query;

    /**
     * @var array
     */
    protected $fields;

    /**
     * @var array
     */
    protected $selectorOptions;

    public function __construct(
        \Neos\Flow\Persistence\Doctrine\Query $query,
        array $fields,
        array $selectorOptions
    ) {
        $this->query = $query;
        $this->fields = $fields;
        $this->selectorOptions = $selectorOptions;
    }

    /**
     * @param mixed $value
     * @return object
     */
    abstract public function getDemands($value);
}
