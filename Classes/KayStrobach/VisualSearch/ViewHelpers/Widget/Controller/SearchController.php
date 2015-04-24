<?php

namespace KayStrobach\VisualSearch\ViewHelpers\Widget\Controller;

use KayStrobach\VisualSearch\Domain\Repository\SearchableRepositoryInterface;
use KayStrobach\VisualSearch\Utility\ArrayUtility;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Persistence\PersistenceManagerInterface;
use TYPO3\Flow\Persistence\QueryInterface;
use TYPO3\Flow\Reflection\Exception\InvalidValueObjectException;


class SearchController extends \TYPO3\Fluid\Core\Widget\AbstractWidgetController {
	/**
	 * @var \TYPO3\Flow\Log\SystemLoggerInterface
	 * @Flow\Inject
	 */
	protected $logger;

	/**
	 * @var \TYPO3\Flow\Configuration\ConfigurationManager
	 * @Flow\Inject
	 */
	public $configurationManager;

	/**
	 * @Flow\Inject
	 * @var PersistenceManagerInterface
	 */
	protected $persistenceManager;

	/**
	 * stores the settings
	 */
	protected $settings = array();

	/**
	 * @var array
	 */
	protected $searchConfiguration = array();

	/**
	 * @var array
	 */
	protected $facetConfiguration = array();

	/**
	 * @var \TYPO3\Flow\Object\ObjectManager
	 * @Flow\Inject
	 */
	protected $objectManager;

	/**
	 *
	 */
	public function initializeAction() {
		$this->searchConfiguration = $this->configurationManager->getConfiguration(
			'VisualSearch',
			'Searches.' . $this->widgetConfiguration['search']
		);
		unset($this->searchConfiguration['autocomplete']);

		$this->facetConfiguration = $this->configurationManager->getConfiguration(
			'VisualSearch',
			'Searches.' . $this->widgetConfiguration['search'] . '.autocomplete'
		);

		$this->settings = $this->configurationManager->getConfiguration(
			\TYPO3\FLOW\Configuration\ConfigurationManager::CONFIGURATION_TYPE_SETTINGS,
			'KayStrobach.VisualSearch' . $this->widgetConfiguration['search'] . '.Configuration'
		);
	}

	public function indexAction() {
		$searchConfigurationName = $this->widgetConfiguration['search'];
		$this->view->assign('search', $searchConfigurationName);
		$this->view->assign('settings', $this->searchConfiguration);
		#$this->view->assign('query', 'defaultquery');
	}

	/**
	 * @Flow\SkipCsrfProtection
	 *
	 * @param string $facet
	 * @param string $query
	 * @param string $term
	 * @return string
	 *
	 * @throws InvalidValueObjectException
	 * @throws \TYPO3\Flow\Object\Exception\UnknownObjectException
	 */
	public function valuesAction($facet = '', $query = '', $term = '') {
		$stringLength = isset($this->facetConfiguration[$facet]['labelLength']) ? $this->facetConfiguration[$facet]['labelLength'] : 30;
		$values = array();
		if (isset($this->facetConfiguration[$facet])) {
			if(isset($this->facetConfiguration[$facet]['selector']['values'])) {
				foreach($this->facetConfiguration[$facet]['selector']['values'] as $key => $value) {
					$values[] = array('label' => $value, 'value' => $key);
				}
				return json_encode($values);
			} elseif(isset($this->facetConfiguration[$facet]['selector']['repository'])) {
				/** @var \TYPO3\Flow\Persistence\RepositoryInterface|SearchableRepositoryInterface $repository */
				$repository = $this->objectManager->get($this->facetConfiguration[$facet]['selector']['repository']);
				if ($repository instanceOf SearchableRepositoryInterface) {
					// find by search term, labelProperty, etc
					// @todo think about replacing the labelProperty with the whole config array
					$entities = $repository->findBySearchTerm(
						$query,
						$term,
						$this->facetConfiguration[$facet]['selector']
					)->getQuery()->setLimit(10)->execute(TRUE);
				} else {
					if(isset($this->facetConfiguration[$facet]['selector']['orderBy'])) {
						$entities = $repository->findAll()->getQuery()->setOrderings(
							array($this->facetConfiguration[$facet]['selector']['orderBy']  => QueryInterface::ORDER_ASCENDING)
						)->execute(TRUE);
					} else {
						$entities = $repository->findAll();
					}

				}
				foreach($entities as $key => $entity) {
					if(method_exists($entity, '__toString')) {
						$values[] = array(
							'label' => (string)$entity,
							'value' => $this->shortenString($this->persistenceManager->getIdentifierByObject($entity), $stringLength)
						);
					} else {
						$label = $this->shortenString(
							\TYPO3\Flow\Reflection\ObjectAccess::getPropertyPath(
								$entity,
								$this->facetConfiguration[$facet]['selector']['labelProperty']
							)
						);
						$values[] = array(
							'label' => $label,
							'value' => $this->persistenceManager->getIdentifierByObject($entity)
						);
					}
				}
			}
		}
		return json_encode($values);
	}

	/**
	 * @Flow\SkipCsrfProtection
	 *
	 * @param array $query
	 * @param string $term
	 * @return string
	 */
	public function facetsAction($query = array(), $term = '') {
		$facets = array();
		$lowerCasedTerm = strtolower($term);
		if ((is_array($this->facetConfiguration)) && (count($this->facetConfiguration) > 0)) {
			foreach($this->facetConfiguration as $key => $value) {
				$label = isset($value['label']) ? $value['label'] : $key;

				// restrict to items filtered by term
				if(($term === '')
					|| (strtolower(substr($label, 0, strlen($lowerCasedTerm))) === $lowerCasedTerm)
					|| (strtolower(substr($key, 0, strlen($lowerCasedTerm))) === $lowerCasedTerm)
				) {

					// should item be displayed just once?
					if((!isset($value['selector']['conditions']['once']))
						|| (($value['selector']['conditions']['once']) && (!ArrayUtility::hasSubEntryWith($query, 'facet', $key)))) {

						// are all required fields given?
						if((!isset($value['selector']['conditions']['requires']))
							|| ((is_array($value['selector']['conditions']['requires'])) && (ArrayUtility::hasAllSubentries($query, 'facet', $value['selector']['conditions']['requires'])))) {
							$facets[] = array(
								'value' => $key,
								'label' => $label,
								'configuration' => $value['selector']
							);
						}

					}

				}
			}
		}

		return json_encode($facets);
	}

	/**
	 * @param array $query
	 * @return string
	 */
	public function countAction($query = array()) {
		$searchConfigurationName = $this->widgetConfiguration['search'];
		$repositoryName = $this->facetConfiguration[$searchConfigurationName];
		/** @var \TYPO3\Flow\Persistence\RepositoryInterface|SearchableRepositoryInterface $repository */
		$repository = $this->objectManager->get($repositoryName);

		return json_encode($repository->findBySearchTerm($query)->getQuery()->count());
	}

	protected function shortenString($string, $length = '30', $append = '...') {
		if(strlen($string) <= $length) {
			return $string;
		} else {
			return substr($string, 0, $length) . $append;
		}
	}
}