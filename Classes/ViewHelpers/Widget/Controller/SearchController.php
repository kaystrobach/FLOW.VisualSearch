<?php

namespace KayStrobach\VisualSearch\ViewHelpers\Widget\Controller;

use KayStrobach\VisualSearch\Domain\Repository\SearchableRepositoryInterface;
use KayStrobach\VisualSearch\Domain\Repository\SearchRepository;
use KayStrobach\VisualSearch\Domain\Session\QueryDto;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Reflection\Exception\InvalidValueObjectException;

class SearchController extends \Neos\FluidAdaptor\Core\Widget\AbstractWidgetController
{
    /**
     * @var \Neos\Flow\Configuration\ConfigurationManager
     * @Flow\Inject
     */
    public $configurationManager;

    /**
     * @var array
     */
    protected $searchConfiguration = [];

    /**
     * @var array
     */
    protected $facetConfiguration = [];

    /**
     * @var \Neos\Flow\ObjectManagement\ObjectManager
     * @Flow\Inject
     */
    protected $objectManager;

    /**
     * @var \KayStrobach\VisualSearch\Domain\Session\QueryStorage
     * @Flow\Inject
     */
    protected $queryStorage;

    /**
     * @var \KayStrobach\VisualSearch\Domain\Repository\FacetRepository
     * @Flow\Inject
     */
    protected $facetRepository;

    /**
     * @var \KayStrobach\VisualSearch\Domain\Service\ValueService
     * @Flow\Inject
     */
    protected $valueService;

    /**
     * @Flow\Inject
     * @var SearchRepository
     */
    protected $searchRepository;

    public function initializeAction()
    {
        parent::initializeAction();
        $this->searchConfiguration = $this->searchRepository->findByName($this->widgetConfiguration['search']);
        $this->facetConfiguration = $this->searchConfiguration->offsetGet('autocomplete');
        unset($this->searchConfiguration['autocomplete']);
    }

    public function indexAction()
    {
        $searchConfigurationName = $this->widgetConfiguration['search'];
        $this->view->assign('search', $searchConfigurationName);
        $this->view->assign('settings', $this->searchConfiguration);
        $this->view->assign('query', $this->queryStorage->getQuery($this->widgetConfiguration['search']));
    }

    /**
     * @Flow\SkipCsrfProtection
     *
     * @param string $facet
     * @param array  $query
     * @param string $term
     *
     * @throws InvalidValueObjectException
     * @throws \Neos\Flow\ObjectManagement\Exception\UnknownObjectException
     *
     * @return string
     */
    public function valuesAction($facet = '', $query = [], $term = '')
    {
        $values = $this->valueService->getValuesByFacetQueryAndTerm(
            $this->widgetConfiguration['search'],
            $facet,
            $query,
            $term
        );

        return json_encode($values);
    }

    /**
     * @Flow\SkipCsrfProtection
     *
     * @param array  $query
     * @param string $term
     *
     * @return string
     */
    public function facetsAction($query = [], $term = '')
    {
        $facets = $this->facetRepository->findFacetsByQueryAndTerm(
            $this->widgetConfiguration['search'],
            $query,
            $term
        );

        return json_encode($facets);
    }

    /**
     * @param QueryDto $query
     * @return string
     *
     * @Flow\SkipCsrfProtection
     */
    public function storeQueryAction(QueryDto $query): string
    {
        $this->queryStorage->setQuery(
            $query
        );

        return 'OK';
    }

    /**
     * @param array $query
     *
     * @return string
     */
    public function countAction($query = [])
    {
        $searchConfigurationName = $this->widgetConfiguration['search'];
        $repositoryName = $this->facetConfiguration[$searchConfigurationName];
        /** @var \Neos\Flow\Persistence\RepositoryInterface|SearchableRepositoryInterface $repository */
        $repository = $this->objectManager->get($repositoryName);

        return json_encode($repository->findBySearchTerm($query)->getQuery()->count());
    }
}
