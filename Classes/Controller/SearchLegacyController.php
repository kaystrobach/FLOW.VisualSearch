<?php
namespace KayStrobach\VisualSearch\Controller;

use KayStrobach\VisualSearch\Domain\Session\QueryDto;
use KayStrobach\VisualSearch\Domain\Session\QueryStorage;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\RestController;
use Neos\Flow\Mvc\View\JsonView;

/**
 * @Flow\Scope("session")
 */
class SearchLegacyController extends RestController
{
    /**
     * @var QueryStorage
     * @Flow\Inject
     */
    protected $queryStorage;

    /**
     * The default view object to use if none of the resolved views can render
     * a response for the current request.
     *
     * @var string
     * @api
     */
    protected $defaultViewObjectName = JsonView::class;

    /**
     * A list of IANA media types which are supported by this controller
     *
     * @var array
     * @see http://www.iana.org/assignments/media-types/index.html
     */
    protected $supportedMediaTypes = ['application/json'];

    /**
     * @param QueryDto $query
     * @Flow\Session(autoStart = true)
     */
    public function queryAction(QueryDto $query)
    {
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

        $this->view->assign('value', $storedQuery);
    }
}
