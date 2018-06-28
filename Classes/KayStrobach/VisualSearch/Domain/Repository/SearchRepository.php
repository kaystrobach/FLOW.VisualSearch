<?php

namespace KayStrobach\VisualSearch\Domain\Repository;
use Neos\Flow\Annotations as Flow;

/**
 * @Flow\Scope("singleton")
 */
class SearchRepository {
	/**
	 * @var \Neos\Flow\Configuration\ConfigurationManager
	 * @Flow\Inject
	 */
	public $configurationManager;

	/**
	 * @param $searchName
	 * @return array
	 */
	public function findByName($searchName) {
		return $this->configurationManager->getConfiguration(
			'VisualSearch',
			'Searches.' . $searchName
		);
	}
}