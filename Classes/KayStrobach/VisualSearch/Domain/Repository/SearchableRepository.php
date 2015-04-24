<?php
/**
 * Created by PhpStorm.
 * User: kay
 * Date: 23.04.15
 * Time: 16:49
 */

namespace KayStrobach\VisualSearch\Domain\Repository;
use TYPO3\Flow\Persistence\QueryResultInterface;
use TYPO3\Flow\Persistence\Doctrine\Repository;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Persistence\QueryInterface;


/**
 * @Flow\Scope("singleton")
 */
class SearchableRepository extends Repository implements SearchableRepositoryInterface {
	/**
	 * helps to use the data objects of the search
	 *
	 * @Flow\Inject
	 * @var \KayStrobach\VisualSearch\Utility\MapperUtility
	 */
	protected $mapperUtility;

	/**
	 * Function to aid KayStrobach.VisualSearch to find entries
	 *
	 * @param array $query
	 * @param string $term
	 * @param array $facetConfiguration
	 * @param array $searchConfiguration
	 * @return QueryResultInterface
	 */
	public function findBySearchTerm($query, $term = '', $facetConfiguration = array(), $searchConfiguration = array()) {
		$query = $this->createQuery();

		// restrict by number of records by term
		if(isset($facetConfiguration['labelProperty'])) {
			$query->matching(
				$query->like(
					$facetConfiguration['labelProperty'], '%' . $term . '%'
				)
			);
		}

		// set orderings
		if(isset($facetConfiguration['orderBy'])) {
			$query->setOrderings(
				array($facetConfiguration['orderBy']  => QueryInterface::ORDER_ASCENDING)
			);
		}
		return $query->execute();
	}
}