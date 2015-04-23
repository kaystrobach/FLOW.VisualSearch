<?php
/**
 * Created by PhpStorm.
 * User: kay
 * Date: 23.04.15
 * Time: 16:49
 */

namespace KayStrobach\VisualSearch\Domain\Repository;
use TYPO3\Flow\Persistence\QueryResultInterface;
use TYPO3\Flow\Persistence\Repository;
use TYPO3\Flow\Annotations as Flow;


class SearchableRepository extends Repository implements SearchableRepositoryInterface {

	/**
	 * @param array $query
	 * @param string $term
	 * @return QueryResultInterface
	 */
	public function findBySearchTerm($query, $term = '') {
		// TODO: Implement findBySearchTerm() method.
	}
}