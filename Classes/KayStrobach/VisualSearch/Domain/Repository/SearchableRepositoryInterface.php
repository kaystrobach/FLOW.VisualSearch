<?php
/**
 * Created by PhpStorm.
 * User: kay
 * Date: 21.04.15
 * Time: 09:12
 */

namespace KayStrobach\VisualSearch\Domain\Repository;

use TYPO3\Flow\Persistence\QueryResultInterface;

interface SearchableRepositoryInterface {
	/**
	 * @param array $query
	 * @param string $term
	 * @param array $facetConfiguration
	 * @return QueryResultInterface
	 */
	public function findBySearchTerm($query, $term = '', $facetConfiguration = array());

	/**
	 * Finds an object matching the given identifier.
	 *
	 * @param mixed $identifier The identifier of the object to find
	 * @return object The matching object if found, otherwise NULL
	 * @api
	 */
	public function findByIdentifier($identifier);

	/**
	 * Returns the classname of the entities this repository is managing.
	 *
	 * Note that anything that is an "instanceof" this class is accepted
	 * by the repository.
	 *
	 * @return string
	 * @api
	 */
	public function getEntityClassName();
}