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
	 * @var \TYPO3\Flow\Log\SystemLoggerInterface
	 * @Flow\Inject
	 */
	protected $systemLogger;

	/**
	 * @var \TYPO3\Flow\ObjectManagement\ObjectManager
	 * @Flow\Inject
	 */
	protected $objectManager;

	/**
	 * @var \TYPO3\Flow\Configuration\ConfigurationManager
	 * @Flow\Inject
	 */
	protected $configurationManager;

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

	// -------------------------------------------------------------------------
	/**
	 * iterates over all
	 *
	 * @todo make it work with multiple values per facet
	 *
	 * @param string $searchName
	 * @param array $query
	 * @param \TYPO3\Flow\Persistence\Doctrine\Query $queryObject
	 * @return array
	 */
	public function buildQuery($searchName, $query, $queryObject) {

		$searchConfiguration = $this->configurationManager->getConfiguration(
			'VisualSearch',
			'Searches.' . $searchName . '.autocomplete'
		);

		$demands = array();
		foreach ($query as $queryEntry) {
			if (isset($queryEntry['facet'])) {
				$facet = $queryEntry['facet'];
				if (isset($searchConfiguration[$facet]['selector']['repository'])) {
					$repositoryClassName = $searchConfiguration[$facet]['selector']['repository'];
					/** @var \TYPO3\Flow\Persistence\Doctrine\Repository $repository */
					$repository = $this->objectManager->get($repositoryClassName);
					$value = $repository->findByIdentifier($queryEntry['value']);
					$this->systemLogger->log('Facet: ' . $facet . ' = ' . $queryEntry['value'] . ' as Object ' . get_class($value), LOG_DEBUG);
				} else {
					$value = $queryEntry['value'];
					$this->systemLogger->log('Facet: ' . $facet . ' = ' . $queryEntry['value'] . ' as string', LOG_DEBUG);
				}
				if (isset($searchConfiguration[$facet]['matches']['equals']) && (is_array($searchConfiguration[$facet]['matches']['equals']))) {
					$this->systemLogger->log('add equals demand for ' . $facet, LOG_DEBUG);
					$subDemands = array();
					foreach ($searchConfiguration[$facet]['matches']['equals'] as $matchField) {
						$subDemands[] = $queryObject->equals($matchField, $value);
					}
					$demands[] = $queryObject->logicalOr($subDemands);
				}
				if (isset($searchConfiguration[$facet]['matches']['like']) && (is_array($searchConfiguration[$facet]['matches']['like']))) {
					$this->systemLogger->log('add like demand for ' . $facet, LOG_DEBUG);
					$subDemands = array();
					foreach ($searchConfiguration[$facet]['matches']['like'] as $matchField) {
						$subDemands[] = $queryObject->like($matchField, '%' . $value . '%');
					}
					$demands[] = $queryObject->logicalOr($subDemands);
				}
			}
		}
		return $demands;
	}
}