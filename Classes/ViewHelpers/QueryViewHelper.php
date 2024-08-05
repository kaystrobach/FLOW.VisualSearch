<?php

namespace KayStrobach\VisualSearch\ViewHelpers;

use Neos\Flow\Annotations as Flow;
use KayStrobach\VisualSearch\Domain\Session\QueryStorage;

class QueryViewHelper extends \Neos\FluidAdaptor\Core\ViewHelper\AbstractViewHelper {
    /**
     * @var QueryStorage
     * @Flow\Inject
     */
    protected $queryStorage;

    public function render() {
        try {
            return json_encode($this->queryStorage->getQuery("pokemon")->jsonSerialize()); // TODO move into template
        } catch (\Exception $e) {
            return htmlspecialchars(json_encode(["error" => $e->getMessage()]));
        }
    }
}
