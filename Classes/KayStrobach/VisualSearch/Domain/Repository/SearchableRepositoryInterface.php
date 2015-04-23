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
	 * @param $term
	 * @return QueryResultInterface
	 */
	public function findBySearchTerm($term);

	/**
	 * Finds an object matching the given identifier.
	 *
	 * @param mixed $identifier The identifier of the object to find
	 * @return object The matching object if found, otherwise NULL
	 * @api
	 */
	public function findByIdentifier($identifier);
}