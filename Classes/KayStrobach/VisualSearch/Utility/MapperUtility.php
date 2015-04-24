<?php
/**
 * Created by PhpStorm.
 * User: kay
 * Date: 24.04.15
 * Time: 09:22
 */

namespace KayStrobach\VisualSearch\Utility;
use KayStrobach\VisualSearch\Utility\ArrayUtility;
use TYPO3\Flow\Annotations as Flow;


class MapperUtility {
	/**
	 * @var \TYPO3\Flow\Object\ObjectManager
	 * @Flow\Inject
	 */
	protected $objectManager;

	/**
	 * @var \TYPO3\Flow\Log\SystemLoggerInterface
	 * @Flow\Inject
	 */
	protected $logger;

	/**
	 * @param array $searchConfiguration
	 * @param array $query
	 * @param string $facet
	 * @return object
	 */
	public function getSingleObject($searchConfiguration, $query, $facet) {
		$facetEntry = ArrayUtility::getOneSubEntryWith($query, 'facet', $facet);
		$objectIdentifier = $facetEntry['value'];
		/** @var \TYPO3\Flow\Persistence\Repository $objectRepository */
		$objectRepository = $this->objectManager->get($searchConfiguration[$facet]['selector']['repository']);
		return $objectRepository->findByIdentifier($objectIdentifier);
	}
}