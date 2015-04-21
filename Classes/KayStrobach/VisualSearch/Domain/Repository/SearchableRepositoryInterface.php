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

}