<?php

namespace KayStrobach\VisualSearch\Domain\Model;

use Doctrine\Common\Collections\ArrayCollection;
use Neos\Flow\Persistence\Doctrine\Query;

class SearchQuery
{
    protected $facetsAndValues;

    protected $sorting;

    public function __construct()
    {
        $this->facetsAndValues = new ArrayCollection();
    }

    public function buildQuery(Query $queryObject): Query
    {
        return $queryObject;
    }
}
