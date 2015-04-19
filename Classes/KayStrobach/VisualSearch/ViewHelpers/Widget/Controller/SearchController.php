<?php

namespace KayStrobach\VisualSearch\ViewHelpers\Widget\Controller;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Aop\JoinPoint;
use TYPO3\Flow\Security\Exception\AccessDeniedException;


class SearchController extends \TYPO3\Fluid\Core\Widget\AbstractWidgetController {
	/**
	 * @var \TYPO3\Flow\Log\SystemLoggerInterface
	 * @Flow\Inject
	 */
	protected $logger;

	/**
	 * @var \TYPO3\Flow\Configuration\ConfigurationManager
	 * @FLOW\Inject
	 */
	public $configurationManager;

	/**
	 * stores the settings
	 */
	protected $settings = array();

	/**
	 *
	 */
	public function initializeAction() {
		$itemsFromMenus = $this->configurationManager->getConfiguration(
			'VisualSearch',
			'KayStrobach.VisualSearch.Searches.' . $this->widgetConfiguration['search'] . '.Items'
		);

		$this->settings = $this->configurationManager->getConfiguration(
			\TYPO3\FLOW\Configuration\ConfigurationManager::CONFIGURATION_TYPE_SETTINGS,
			'KayStrobach.Menu.Menus.' . $this->widgetConfiguration['menu'] . '.Configuration'
		);
		if($this->widgetConfiguration['debug']) {
			$this->debug = $this->configurationManager->getConfiguration(
				\TYPO3\FLOW\Configuration\ConfigurationManager::CONFIGURATION_TYPE_SETTINGS,
				'KayStrobach.Menu.Menus'
			);
		}
	}

	public function indexAction() {
		$this->aggregateNodes($this->items);
		$this->items = $this->getAllowedNodesAndNonEmptySections($this->items);
		$this->view->assign('settings', $this->settings);
		$this->view->assign('items',    $this->items);
		$this->view->assign('config',   $this->widgetConfiguration);
		if($this->widgetConfiguration['debug']) {
			$this->view->assign('debug', print_r($this->debug, TRUE));
		}
	}

	/**
	 * @param array $items
	 * @throws \Exception
	 */
	protected function aggregateNodes(&$items) {
		if(is_array($items)) {
			foreach($items as $key => $item) {
				if(array_key_exists('aggregator', $item)) {
					$object = $this->objectManager->get($item['aggregator']);
					if(is_a($object, '\\KayStrobach\\Menu\\Domain\\Model\\MenuItemInterface')) {
						$this->logger->log('Dynamic Menu Config ' . json_encode($item), LOG_DEBUG);
						$item['items'] = $object->getItems($item);
						$items[$key]   = $item;
						$this->logger->log('Dynamic Menu after aggregation ' . json_encode($item), LOG_DEBUG);
					} else {
						throw new \Exception('Sry, but "' . get_class($object) . '" is does not implement "\\KayStrobach\\Menu\\Domain\\Model\\MenuItemInterface", this is mandatory for menu aggregators.');
					}
				}
				if(array_key_exists('items', $item)) {
					$this->aggregateNodes($item['items']);
				}
			}
			ksort($items);
		} else {
			$items = array();
		}
	}

	/**
	 * @param array $items
	 * @return array
	 */
	protected function getAllowedNodesAndNonEmptySections($items) {
		$thisLevelItems = array();
		foreach($items as $item) {
			if(array_key_exists('items', $item)) {
				$subItems = $this->getAllowedNodesAndNonEmptySections($item['items']);
				if((array_key_exists('section', $item)) && ($item['section'] === 1) && (count($subItems) > 0)) {
					$item['items'] = $subItems;
					$thisLevelItems[] = $item;
				}
			} elseif (array_key_exists('url', $item)) {
				$thisLevelItems[] = $item;
			} elseif((array_key_exists('package', $item)) && (array_key_exists('controller', $item)) && (array_key_exists('action', $item))) {
				if($this->hasAccessToAction($item['package'], NULL, $item['controller'], $item['action'])) {
					$thisLevelItems[] = $item;
				}
			}
		}
		return $thisLevelItems;
	}
	/**
	 * Check if we currently have access to the given resource
	 *
	 * @param $packageKey
	 * @param $subpackageKey
	 * @param $controllerName
	 * @param $actionName
	 * @return boolean TRUE if we currently have access to the given action
	 */
	protected function hasAccessToAction($packageKey, $subpackageKey, $controllerName, $actionName) {
		$actionControllerObjectName = $this->getControllerObjectName($packageKey, $subpackageKey, $controllerName);
		try {
			$this->accessDecisionVoterManager->decideOnJoinPoint(
				new JoinPoint(
					NULL,
					$actionControllerObjectName,
					$actionName . 'Action',
					array()
				)
			);
			return TRUE;
		} catch(AccessDeniedException $e) {
			return FALSE;
		}
	}

	/**
	 * @param string $packageKey
	 * @param string $subPackageKey
	 * @param string $controllerName
	 * @return string|null
	 */
	protected function getControllerObjectName($packageKey, $subPackageKey, $controllerName) {
		$possibleObjectName = str_replace('.', '\\', $packageKey) . '\\';
		if(($subPackageKey !== NULL) && (strlen($subPackageKey) > 0)) {
			$possibleObjectName .= $subPackageKey . '\\';
		}
		$possibleObjectName .= 'Controller\\' . $controllerName . 'Controller';

		$controllerObjectName = $this->objectManager->getCaseSensitiveObjectName($possibleObjectName);
		return ($controllerObjectName !== FALSE) ? $controllerObjectName : NULL;
	}
}