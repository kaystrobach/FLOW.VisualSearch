<?php
namespace KayStrobach\VisualSearch\Controller;

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

    function facetsAction(string $search, array $query, string $term)
    {
        // TODO fetch query from session if not given via url parameters -> not necessary ?!

        $facets = $this->facetRepository->findFacetsByQueryAndTerm($search, $query, $term);

        return json_encode($facets, JSON_THROW_ON_ERROR|JSON_INVALID_UTF8_IGNORE);
    }

    function valuesAction(string $search, string $facet, array $query, string $term)
    {
        // TODO fetch query from session if not given via url parameters -> not necessary ?!

        $values = $this->valueService->getValuesByFacetQueryAndTerm($search, $facet, $query, $term);

        return json_encode($values, JSON_THROW_ON_ERROR|JSON_INVALID_UTF8_IGNORE);
    }
}
