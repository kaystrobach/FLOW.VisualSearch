<?php
namespace KayStrobach\VisualSearch\Controller;

use KayStrobach\VisualSearch\Domain\Session\QueryDto;
use KayStrobach\VisualSearch\Domain\Session\QueryStorage;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\RestController;
use KayStrobach\VisualSearch\Domain\Repository\FacetRepository;
use KayStrobach\VisualSearch\Domain\Service\ValueService;
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

    function facetsAction(string $search, string $query, string $term)
    {
        $queryArray = json_decode(urldecode(base64_decode($query, true)), true);

        $facets = $this->facetRepository->findFacetsByQueryAndTerm($search, $queryArray, $term);

        return json_encode($facets, JSON_THROW_ON_ERROR|JSON_INVALID_UTF8_IGNORE);
    }

    function valuesAction(string $search, string $facet, string $query, string $term)
    {
        $queryArray = json_decode(urldecode(base64_decode($query, true)), true);

        $values = $this->valueService->getValuesByFacetQueryAndTerm($search, $facet, $queryArray, $term);

        return json_encode($values, JSON_THROW_ON_ERROR|JSON_INVALID_UTF8_IGNORE);
    }
}
