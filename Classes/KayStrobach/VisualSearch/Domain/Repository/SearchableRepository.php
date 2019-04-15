<?php

namespace KayStrobach\VisualSearch\Domain\Repository;
use Neos\Flow\Error\Debugger;
use Neos\Flow\Persistence\QueryResultInterface;
use Neos\Flow\Persistence\Doctrine\Repository;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Persistence\QueryInterface;
use Neos\Utility\ObjectAccess;

/**
 * @Flow\Scope("singleton")
 */
class SearchableRepository extends Repository implements SearchableRepositoryInterface {
	/**
	 * spezifies the default search used in visualsearch with that repository
	 *
	 * @var string
	 */
	protected $defaultSearchName = NULL;

	/**
	 * helps to use the data objects of the search
	 *
	 * @Flow\Inject()
	 * @var \KayStrobach\VisualSearch\Utility\MapperUtility
	 */
	protected $mapperUtility;

	/**
	 * @var \Neos\Flow\Log\SystemLoggerInterface
	 * @Flow\Inject()
	 */
	protected $systemLogger;

    /**
     * @var \KayStrobach\VisualSearch\Domain\Session\QueryStorage
     * @Flow\Inject()
     */
    protected $queryStorage;

    /**
     * Function to aid KayStrobach.VisualSearch to find entries
     *
     * @param array $query
     * @param string $term
     * @param array $facetConfiguration
     * @param array $searchConfiguration
     * @return QueryResultInterface
     * @throws \Neos\Flow\Persistence\Exception\InvalidQueryException
     * @throws \Neos\Utility\Exception\PropertyNotAccessibleException
     */
	public function findBySearchTerm($query, $term = '', $facetConfiguration = array(), $searchConfiguration = array()) {
		$queryObject = $this->createQuery();

		// restrict by number of records by term
		if (isset($facetConfiguration['labelProperty'])) {
            $labelMatcher = 'before';
		    if (isset($facetConfiguration['labelMatcher'])) {
		        $labelMatcher = $facetConfiguration['labelMatcher'];
            }
            switch($labelMatcher) {
                case 'beginsWith':
                    $queryObject->matching(
                        $queryObject->like(
                            $facetConfiguration['labelProperty'], $term . '%'
                        )
                    );
                    break;
                case 'endsWith':
                    $queryObject->matching(
                        $queryObject->like(
                            $facetConfiguration['labelProperty'], '%' . $term . '%'
                        )
                    );
                    break;
		        case 'contains':
		        default:
                    $queryObject->matching(
                        $queryObject->like(
                            $facetConfiguration['labelProperty'], '%' . $term . '%'
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
                    array($facetConfiguration['orderBy']  => QueryInterface::ORDER_ASCENDING)
                );
            }
		}

		/** @var $doctrineQueryBuilder \Doctrine\ORM\QueryBuilder */
		$doctrineQueryBuilder = ObjectAccess::getProperty($queryObject, 'queryBuilder', TRUE);
		/** @var $doctrineQuery \Doctrine\ORM\Query */
		$doctrineQuery = $doctrineQueryBuilder->getQuery();

		$this->systemLogger->log('findBySearchTerm:' . $doctrineQuery->getSQL(), LOG_ALERT);

		return $queryObject->execute();
	}

    public function findByDefaultQuery()
    {
        $this->findByNamedQuery($this->defaultSearchName);
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
	 * this function should be used to display the filtered result list
	 *
	 * @param array $query
	 * @param null $searchName
	 * @return QueryResultInterface
	 */
	public function findByQuery($query, $searchName = NULL) {
		if ($searchName === NULL) {
			if (isset($this->defaultSearchName)) {
				$searchName = $this->defaultSearchName;
			} else {
				$searchName = $this->getEntityClassName();
			}
		}

		$demands = array();
		$queryObject = $this->createQuery();

		// get all the other filters
		if (method_exists($this, 'initializeFindByQuery')) {
			$demands = $this->initializeFindByQuery($queryObject, $searchName);
		}

		// merge demands from VisualSearch.yaml and the
		$demands = array_merge($demands, $this->mapperUtility->buildQuery($searchName, $query, $queryObject));

		$this->systemLogger->log('demands: ' . Debugger::renderDump($demands, 2, TRUE));

		if(count($demands) > 0) {
			$queryObject->matching(
				$queryObject->logicalAnd(
					$demands
				)
			);
		}

		/** @var $doctrineQueryBuilder \Doctrine\ORM\QueryBuilder */
		$doctrineQueryBuilder = ObjectAccess::getProperty($queryObject, 'queryBuilder', TRUE);
		/** @var $doctrineQuery \Doctrine\ORM\Query */
		$doctrineQuery = $doctrineQueryBuilder->getQuery();
		$this->systemLogger->log(
			'findByQuery:' . $doctrineQuery->getSQL() . PHP_EOL
			. Debugger::renderDump($doctrineQuery->getParameters(), 2, TRUE),
			LOG_DEBUG
		);

		$doctrineQueryBuilder->distinct(true);
		ObjectAccess::setProperty($queryObject, 'queryBuilder', $doctrineQueryBuilder);

		return $queryObject->execute();
	}

	/**
	 * add demands into the query
	 *
	 * @param \Neos\Flow\Persistence\Doctrine\Query $queryObject
	 * @param string $searchName
	 *
	 * @return array
	 */
	protected function initializeFindByQuery($queryObject, $searchName) {
		return array();
	}
}
