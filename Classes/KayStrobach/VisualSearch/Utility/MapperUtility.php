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
	 * @Flow\Inject
	 * @var \TYPO3\Flow\Log\SystemLoggerInterface
	 */
	protected $systemLogger;

	/**
	 * @var \TYPO3\Flow\Configuration\ConfigurationManager
	 * @Flow\Inject
	 */
	public $configurationManager;

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

	//-------------------------------------------------------------------------
	/**
	 * iterates over all
	 *
	 * @todo make it work with multiple values per facet
	 *
	 * @param string $searchName
	 * @param array $query
	 * @param \TYPO3\Flow\Persistence\Doctrine\Query $queryObject
	 * @return object
	 */
	public function buildQuery($searchName, $query, &$queryObject) {

		$searchConfiguration = $this->configurationManager->getConfiguration(
			'VisualSearch',
			'Searches.' . $searchName . '.autocomplete'
		);

		$demands = array();
		foreach($query as $queryEntry) {
			$facet = $queryEntry['facet'];
			if(isset($searchConfiguration[$facet]['selector']['repository'])) {
				$repositoryClassName = $searchConfiguration[$facet]['selector']['repository'];
				/** @var \TYPO3\Flow\Persistence\Doctrine\Repository $repository */
				$repository = $this->objectManager->get($repositoryClassName);
				$value = $repository->findByIdentifier($queryEntry['value']);
			} else {
				$value = $queryEntry['value'];
			}
			if(isset($searchConfiguration[$facet]['matches']['equals']) && (is_array($searchConfiguration[$facet]['matches']['equals'])) ) {
				$subDemands = array();
				foreach($searchConfiguration[$facet]['matches']['equals'] as $matchField) {
					$queryObject->equals($matchField, $value);
					$this->systemLogger->log('SEARCH: ' . $searchName . ' - ' . $facet . ' - ' . $matchField . ' - ' . $queryEntry['value']);
				}
				$demands[] = $queryObject->logicalOr($subDemands);
			}
		}
		return $queryObject->logicalAnd($demands);
	}
}