<?php

namespace KayStrobach\VisualSearch\Domain\Repository;

use Doctrine\ORM\QueryBuilder;
use KayStrobach\VisualSearch\Domain\Session\QueryDto;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Error\Debugger;
use Neos\Flow\Persistence\Doctrine\Repository;
use Neos\Flow\Persistence\QueryInterface;
use Neos\Flow\Persistence\QueryResultInterface;
use Neos\Utility\ObjectAccess;
use Psr\Log\LoggerInterface;

/**
 * @Flow\Scope("singleton")
 */
class SearchableRepository extends Repository implements SearchableRepositoryInterface
{
    /**
     * spezifies the default search used in visualsearch with that repository.
     *
     * @var string
     */
    protected $defaultSearchName = null;

    /**
     * helps to use the data objects of the search.
     *
     * @Flow\Inject()
     *
     * @var \KayStrobach\VisualSearch\Utility\MapperUtility
     */
    protected $mapperUtility;

    /**
     * @Flow\Inject()
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * @var \KayStrobach\VisualSearch\Domain\Session\QueryStorage
     * @Flow\Inject()
     */
    protected $queryStorage;

    /**
     * Function to aid KayStrobach.VisualSearch to find entries.
     *
     * @param array  $query
     * @param string $term
     * @param array  $facetConfiguration
     * @param array  $searchConfiguration
     *
     * @throws \Neos\Flow\Persistence\Exception\InvalidQueryException
     * @throws \Neos\Utility\Exception\PropertyNotAccessibleException
     *
     * @return QueryResultInterface
     */
    public function findBySearchTerm($query, $term = '', $facetConfiguration = [], $searchConfiguration = [])
    {
        $queryObject = $this->createQuery();

        // restrict by number of records by term
        if (isset($facetConfiguration['labelProperty'])) {
            $labelMatcher = 'before';
            if (isset($facetConfiguration['labelMatcher'])) {
                $labelMatcher = $facetConfiguration['labelMatcher'];
            }
            switch ($labelMatcher) {
                case 'beginsWith':
                    $queryObject->matching(
                        $queryObject->like(
                            $facetConfiguration['labelProperty'],
                            $term.'%'
                        )
                    );
                    break;
                case 'endsWith':
                    $queryObject->matching(
                        $queryObject->like(
                            $facetConfiguration['labelProperty'],
                            '%'.$term.'%'
                        )
                    );
                    break;
                case 'contains':
                default:
                    $queryObject->matching(
                        $queryObject->like(
                            $facetConfiguration['labelProperty'],
                            '%'.$term.'%'
                        )
                    );
            }
        }

        // set orderings
        if (isset($facetConfiguration['orderBy'])) {
            if (is_array($facetConfiguration['orderBy'])) {
                $queryObject->setOrderings(
                    $facetConfiguration['orderBy']
                );
            } else {
                $queryObject->setOrderings(
                    [$facetConfiguration['orderBy']  => QueryInterface::ORDER_ASCENDING]
                );
            }
        }

        /** @var $doctrineQueryBuilder QueryBuilder */
        $doctrineQueryBuilder = ObjectAccess::getProperty($queryObject, 'queryBuilder', true);
        /** @var $doctrineQuery \Doctrine\ORM\Query */
        $doctrineQuery = $doctrineQueryBuilder->getQuery();

        $this->logger->info(
            'findBySearchTerm',
            [
                $doctrineQuery->getSQL()
            ]
        );

        return $queryObject->execute();
    }

    public function findByDefaultQuery()
    {
        return $this->findByNamedQuery($this->defaultSearchName);
    }

    public function findByNamedQuery($name)
    {
        return $this->findByQuery(
            $this->queryStorage->getQuery($name),
            $name
        );
    }

    /**
     * function to filter the repository result by a given query
     * this function should be used to display the filtered result list.
     *
     * @param QueryDto $query
     * @param null $searchName
     *
     * @return QueryResultInterface
     * @throws \Neos\Utility\Exception\PropertyNotAccessibleException
     */
    public function findByQuery(QueryDto $query, $searchName = null)
    {
        if ($searchName === null) {
            $searchName = $this->defaultSearchName;
        }
        if ($searchName === null) {
            $searchName = $this->getEntityClassName();
        }

        $demands = [];
        $queryObject = $this->createQuery();

        // get all the other filters
        if (method_exists($this, 'initializeFindByQuery')) {
            $demands = $this->initializeFindByQuery($queryObject, $searchName);
        }

        // merge demands from VisualSearch.yaml and the
        $demands = array_merge($demands, $this->mapperUtility->buildQuery($searchName, $query, $queryObject));

        $this->logger->info(
            'demands',
            [
                Debugger::renderDump($demands, 2, true)
            ]
        );

        if (count($demands) > 0) {
            $queryObject->matching(
                $queryObject->logicalAnd(
                    $demands
                )
            );
        }

        /** @var $doctrineQueryBuilder QueryBuilder */
        $doctrineQueryBuilder = ObjectAccess::getProperty($queryObject, 'queryBuilder', true);
        $doctrineQuery = $doctrineQueryBuilder->getQuery();

        $this->logger->debug(
            'findByQuery:',
            [
                'sql' => $doctrineQuery->getSQL(),
                'parameters' => Debugger::renderDump($doctrineQuery->getParameters(), 2, true),
            ]
        );

        $doctrineQueryBuilder->distinct(true);
        ObjectAccess::setProperty($queryObject, 'queryBuilder', $doctrineQueryBuilder);

        return $queryObject->execute();
    }

    /**
     * add demands into the query.
     *
     * @param \Neos\Flow\Persistence\Doctrine\Query $queryObject
     * @param string                                $searchName
     *
     * @return array
     */
    protected function initializeFindByQuery($queryObject, $searchName)
    {
        return [];
    }
}
