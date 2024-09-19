<?php
namespace KayStrobach\VisualSearch\Controller;

use KayStrobach\VisualSearch\Domain\Session\QueryDto;
use KayStrobach\VisualSearch\Domain\Session\QueryStorage;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\RestController;
use KayStrobach\VisualSearch\Domain\Repository\FacetRepository;
use KayStrobach\VisualSearch\Domain\Service\ValueService;
use Neos\Flow\Mvc\View\JsonView;

class SearchRestController extends RestController {

    /**
     * @Flow\Inject
     * @var FacetRepository
     */
    protected $facetRepository;

    /**
     * @Flow\Inject
     * @var ValueService
     */
    protected $valueService;

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

    function facetsAction(string $search, string $query, string $term)
    {
        if (!empty($query)) {
            $queryArray = json_decode(urldecode(base64_decode($query, true)), true);
        } else {
            $queryArray = array_map(fn($facet) => $facet->__toArray(), $this->queryStorage->getQuery($search)->getFacets()->toArray());
        }

        $facets = $this->facetRepository->findFacetsByQueryAndTerm($search, $queryArray, $term);

        $this->view->assign('value', $facets);
    }

    function valuesAction(string $search, string $facet, string $query, string $term)
    {
        if (!empty($query)) {
            $queryArray = json_decode(urldecode(base64_decode($query, true)), true);
        } else {
            $queryArray = array_map(fn($facet) => $facet->__toArray(), $this->queryStorage->getQuery($search)->getFacets()->toArray());
        }

        $values = $this->valueService->getValuesByFacetQueryAndTerm($search, $facet, $queryArray, $term);

        $this->view->assign('value', $values);
    }
}
