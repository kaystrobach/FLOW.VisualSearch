<?php
/**
 * Created by PhpStorm.
 * User: kay
 * Date: 24.04.15
 * Time: 13:11
 */

namespace KayStrobach\VisualSearch\Domain\Session;
use TYPO3\Flow\Annotations as Flow;

/**
 * the goal of this class is to store all filters and restore them on load, this way we can store the queries in the
 * session without a large effort
 *
 * @Flow\Scope("session")
 */
class QueryStorage {
	/**
	 * contains all the stored queries as key => value relation
	 * @var array
	 */
	protected $queries = array();

	/**
	 * @param string $name
	 * @return array
	 */
	public function getQuery($name) {
		if(isset($this->queries[$name])) {
			return $this->queries[$name];
		}
		return array();
	}

	/**
	 * @param string name
	 * @param array $query
	 * @return void
	 */
	public function setQuery($name, $query) {
		$this->queries[$name] = $query;
	}

	/**
	 * @return array
	 */
	public function getQueries() {
		return $this->queries;
	}
}