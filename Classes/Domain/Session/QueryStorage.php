<?php
/**
 * Created by PhpStorm.
 * User: kay
 * Date: 24.04.15
 * Time: 13:11.
 */

namespace KayStrobach\VisualSearch\Domain\Session;

use Doctrine\Common\Collections\ArrayCollection;
use KayStrobach\VisualSearch\Utility\ArrayUtility;
use Neos\Flow\Annotations as Flow;
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
     * @var array
     */
    protected $queries = [];

    /**
     * @Flow\Inject
     *
     * @var PersistenceManagerInterface
     */
    protected $persistenceManager;

    /**
     * @param string $name
     *
     * @return array
     */
    public function getQuery($name)
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
    public function isFacetInQuery($name, $facet)
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
    public function setQuery(QueryDto $query)
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
    public function addQueryConstraint($name, $facetLabel, $facet, $valueLabel, $value)
    {
        $id = '';
        if (is_string($facet)) {
            $id = $facet;
        }
        if (is_object($facet)) {
            $id = $this->persistenceManager->getIdentifierByObject($valueLabel);
        }
        if ($id !== null) {
            if (!isset($this->queries[$name])) {
                $this->queries[$name] = [];
            }
            $this->queries[$name][] = [
                'facetLabel' => $facetLabel,
                'facet'      => $id,
                'valueLabel' => $valueLabel,
                'value'      => $value,
            ];
        }
    }

    /**
     * @param string $name
     *
     * @return int
     */
    public function getNumberOfConstraints($name)
    {
        if (isset($this->queries[$name])) {
            return count($this->queries[$name]);
        }

        return 0;
    }
}
