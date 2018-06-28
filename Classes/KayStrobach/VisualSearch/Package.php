<?php
namespace KayStrobach\VisualSearch;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Fluid".                 *
 *                                                                        *
 * It is free software; you can redistribute it and/or modify it under    *
 * the terms of the GNU Lesser General Public License, either version 3   *
 * of the License, or (at your option) any later version.                 *
 *                                                                        *
 * The TYPO3 project - inspiring people to share!                         *
 *                                                                        */

use Neos\Flow\Configuration\ConfigurationManager;
use Neos\Flow\Package\Package as BasePackage;

/**
 * The Fluid Package
 *
 */
class Package extends BasePackage {

	/**
	 * @var boolean
	 */
	protected $protected = TRUE;

	/**
	 * Invokes custom PHP code directly after the package manager has been initialized.
	 *
	 * @param \Neos\Flow\Core\Bootstrap $bootstrap The current bootstrap
	 * @return void
	 */
	public function boot(\Neos\Flow\Core\Bootstrap $bootstrap) {
		// register Configuration Type Menu
		$dispatcher = $bootstrap->getSignalSlotDispatcher();
		$dispatcher->connect(
		    'TYPO3\Flow\Configuration\ConfigurationManager',
            'configurationManagerReady',
			function (ConfigurationManager $configurationManager) {
				$configurationManager->registerConfigurationType('VisualSearch');
			}
		);
	}
}

