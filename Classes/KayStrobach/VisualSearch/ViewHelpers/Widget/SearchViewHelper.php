<?php
namespace KayStrobach\VisualSearch\ViewHelpers\Widget;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Fluid".                 *
 *                                                                        *
 * It is free software; you can redistribute it and/or modify it under    *
 * the terms of the GNU Lesser General Public License, either version 3   *
 * of the License, or (at your option) any later version.                 *
 *                                                                        *
 * The TYPO3 project - inspiring people to share!                         *
 *                                                                        */

use Neos\Flow\Annotations as Flow;
use Neos\FluidAdaptor\Core\Widget\AbstractWidgetViewHelper;

class SearchViewHelper extends AbstractWidgetViewHelper {
	/**
	 * @var bool
	 */
	protected $ajaxWidget = TRUE;

	/**
	 * @Flow\Inject
	 * @var \KayStrobach\VisualSearch\ViewHelpers\Widget\Controller\SearchController
	 */
	protected $controller;

	/**
	 * Render this view helper
	 *
	 * @param string $search
	 * @return string
	 */
	public function render($search = '') {
		$response = $this->initiateSubRequest();
		return $response->getContent();
	}
}

