<?php

namespace KayStrobach\VisualSearch\ViewHelpers\Widget\Controller;

use KayStrobach\VisualSearch\Domain\Repository\SearchableRepositoryInterface;
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
		$this->view->assign('settings', $this->items);
		#$this->view->assign('query', 'defaultquery');
	}

	/**
	 * @Flow\SkipCsrfProtection
	 *
	 * @param string $facet
	 * @param string $query
	 * @return string
	 *
	 * @throws InvalidValueObjectException
	 * @throws \TYPO3\Flow\Object\Exception\UnknownObjectException
	 */
	public function valuesAction($facet = '', $query = '') {
		$stringLength = isset($this->items[$facet]['labelLength']) ? $this->items[$facet]['labelLength'] : 30;
		$values = array();
		if (isset($this->items[$facet])) {
			if(isset($this->items[$facet]['selector']['values'])) {
				foreach($this->items[$facet]['selector']['values'] as $key => $value) {
					$values[] = array('label' => $value, 'value' => $key);
				}
				return json_encode($values);
			} elseif(isset($this->items[$facet]['selector']['repository'])) {
				/** @var \TYPO3\Flow\Persistence\RepositoryInterface|SearchableRepositoryInterface $repository */
				$repository = $this->objectManager->get($this->items[$facet]['selector']['repository']);
				if ($repository instanceOf SearchableRepositoryInterface) {
					$entities = $repository->findBySearchTerm($query)->getQuery()->setLimit(5)->execute(TRUE);
				} else {
					if(!isset($this->items[$facet]['selector']['labelProperty'])) {
						throw new InvalidValueObjectException('Missing labelProperty for search ' . $this->widgetConfiguration['search'] . '.' . $facet . '.selector');
					}
					$entities = $repository->findAll()->getQuery()->setOrderings(array($this->items[$facet]['selector']['labelProperty']  => QueryInterface::ORDER_ASCENDING))->execute(TRUE);
				}
				#
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
								$this->items[$facet]['selector']['labelProperty']
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
	 * @param string $query
	 * @param string $term
	 * @return string
	 */
	public function facetsAction($query = '', $term = '') {
		$facets = array();
		if ((is_array($this->items)) && (count($this->items) > 0)) {
			foreach($this->items as $key => $value) {
				$label = isset($value['label']) ? $value['label'] : $key;
				if(($term === '')
					|| (substr($label, 0, strlen($term)) === $term)
					|| (substr($key, 0, strlen($term)) === $term)
				) {
					$facets[] = array(
						'value' => $key,
						'label' => $label
					);
				}
			}
		}
		return json_encode($facets);
	}

	protected function shortenString($string, $length = '30', $append = '...') {
		if(strlen($string) <= $length) {
			return $string;
		} else {
			return substr($string, 0, $length) . $append;
		}
	}
}