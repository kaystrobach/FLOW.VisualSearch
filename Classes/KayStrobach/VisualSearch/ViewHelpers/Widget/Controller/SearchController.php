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
		return ;
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

	}
}