<?php

namespace KayStrobach\VisualSearch\Domain\Repository;
use TYPO3\Flow\Annotations as Flow;

/**
 * @Flow\Scope("singleton")
 */
class SearchRepository {
	/**
	 * @var \TYPO3\Flow\Configuration\ConfigurationManager
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