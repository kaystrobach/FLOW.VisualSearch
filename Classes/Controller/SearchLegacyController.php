<?php
namespace KayStrobach\VisualSearch\Controller;

use KayStrobach\VisualSearch\Domain\Session\QueryDto;
use KayStrobach\VisualSearch\Domain\Session\QueryStorage;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ActionController;

/**
 * @Flow\Scope("session")
 */
class SearchLegacyController extends ActionController {

    /**
     * @var QueryStorage
     * @Flow\Inject
     */
    protected $queryStorage;

    /**
     * @param QueryDto $query
     * @Flow\Session(autoStart = true)
     */
    function queryAction(QueryDto $query) {
        // TODO implement
        // TODO parse body as json

        // put query into query storage
        // how to start session?
        // maybe move into search controller

        // widgets -> flow 3 / 4

        // flow property mapper
        // initializeQuery action before property mapping

        $this->queryStorage->setQuery($query);
        $storedQuery = $this->queryStorage->getQuery($query->getIdentifier());

        return json_encode($storedQuery, JSON_THROW_ON_ERROR|JSON_INVALID_UTF8_IGNORE);
    }
}
