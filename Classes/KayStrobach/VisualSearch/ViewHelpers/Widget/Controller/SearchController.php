<?php

namespace KayStrobach\VisualSearch\ViewHelpers\Widget\Controller;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Persistence\PersistenceManagerInterface;


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
	protected $items = array();

	/**
	 * @var \TYPO3\Flow\Object\ObjectManager
	 * @Flow\Inject
	 */
	protected $objectManager;

	/**
	 *
	 */
	public function initializeAction() {
		$this->items = $this->configurationManager->getConfiguration(
			'VisualSearch',
			'Searches.' . $this->widgetConfiguration['search']
		);

		$this->settings = $this->configurationManager->getConfiguration(
			\TYPO3\FLOW\Configuration\ConfigurationManager::CONFIGURATION_TYPE_SETTINGS,
			'KayStrobach.VisualSearch' . $this->widgetConfiguration['search'] . '.Configuration'
		);
	}

	public function indexAction() {
		$searchConfigurationName = $this->widgetConfiguration['search'];
		$this->view->assign('search', $searchConfigurationName);
		if ((is_array($this->items)) && (count($this->items) > 0)) {
			$facets = array();
			foreach($this->items as $key => $value) {
				if(array_key_exists('label', $value)) {
					$facets[] = array(
						'value' => $key,
						'label' => $value['label']
					);
				} else {
					$facets[] = array(
						'value' => $key,
						'label' => $key
					);
				}
			}
			$this->view->assign('facets', $facets);
		}
		$this->view->assign('settings', $this->items);
		#$this->view->assign('query', 'defaultquery');
	}

	/**
	 * @Flow\SkipCsrfProtection
	 *
	 * @param string $facet
	 * @param string $query
	 * @return string
	 */
	public function valuesAction($facet = '', $query = '') {
		$values = array();
		if (array_key_exists($facet, $this->items)) {
			if(array_key_exists('values', $this->items[$facet])) {
				foreach($this->items[$facet]['values'] as $key => $value) {
					$values[] = array('label' => $value, 'value' => $key);
				}
				return json_encode($values);
			} elseif(array_key_exists('repository', $this->items[$facet])) {
				/** @var \TYPO3\Flow\Persistence\RepositoryInterface $repository */
				$repository = $this->objectManager->get($this->items[$facet]['repository']);
				$entities = $repository->findAll();
				foreach($entities as $key => $entity) {
					if(method_exists($entity, '__toString')) {
						$values[] = array('label' => (string)$entity, 'value' => $this->persistenceManager->getIdentifierByObject($entity));
					} else {
						$functionName = 'get' . ucfirst($this->items[$facet]['labelProperty']);
						$values[] = array('label' => $entity->$functionName(), 'value' => $this->persistenceManager->getIdentifierByObject($entity));
					}
				}
			}
		}
		return json_encode($values);
	}
}