<?php

namespace KayStrobach\VisualSearch\Domain\Session;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Core\Bootstrap;
use Neos\Flow\Persistence\PersistenceManagerInterface;

/**
 * the goal of this class is to store all filters and restore them on load, this way we can store the queries in the
 * session without a large effort.
 *
 * @Flow\Scope("session")
 */
class QueryStorage
{
    /**
     * contains all the stored queries as key => valueLabel relation.
     *
     * @var array<string, QueryDto>
     */
    protected $queries = [];

    /**
     * @param string $name
     *
     * @return array
     */
    public function getQuery($name): QueryDto
    {
        if (!isset($this->queries[$name])) {
            $this->queries[$name] = new QueryDto();
            $this->queries[$name]->setIdentifier($name);
        }

        return $this->queries[$name];
    }

    /**
     * @param string $name
     * @param string $facet
     *
     * @return bool
     */
    public function isFacetInQuery($name, $facet): bool
    {
        return $this->getOneFacetInQuery($name, $facet) !== null;
    }

    /**
     * @param string $name
     * @param string $facet
     * @return Facet|null
     */
    public function getOneFacetInQuery(string $name, string $facet): ?Facet
    {
        $query = $this->getQuery($name);
        /** @var Facet $facet */
        foreach ($query->getFacets() as $facetObject) {
            if ($facetObject->getFacet() === $facet) {
                return $facetObject;
            }
        }
        return null;
    }

    /**
     * @param QueryDto $query
     *
     * @return void
     */
    public function setQuery(QueryDto $query): void
    {
        $this->queries[$query->getIdentifier()] = $query;
    }

    /**
     * @return array
     */
    public function getQueries()
    {
        return $this->queries;
    }

    /**
     * @param string $name
     * @param string $facet
     * @param mixed  $valueLabel
     */
    public function addQueryConstraint(string $name, string $facetLabel, $facet, $valueLabel, $value): void
    {
        $query = $this->getQuery($name);

        $id = null;
        if (is_string($facet)) {
            $id = $facet;
        } elseif (is_object($facet)) {
            $id = Bootstrap::$staticObjectManager->get(PersistenceManagerInterface::class)->getIdentifierByObject($facet);
        }

        if ($id === null) {
            return;
        }

        $facetObject = new Facet();
        $facetObject->setFacetLabel($facetLabel);
        $facetObject->setFacet((string)$id);
        $facetObject->setValue((string)$value);
        $facetObject->setValueLabel((string)$valueLabel);

        $query->addFacet($facetObject);
    }

    /**
     * @param string $name
     *
     * @return int
     */
    public function getNumberOfConstraints($name): int
    {
        if (isset($this->queries[$name])) {
            return count($this->queries[$name]);
        }

        return 0;
    }
}
