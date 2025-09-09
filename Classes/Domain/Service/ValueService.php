<?php
/**
 * Created by PhpStorm.
 * User: kay
 * Date: 06.05.15
 * Time: 18:12.
 */

namespace KayStrobach\VisualSearch\Domain\Service;

use KayStrobach\VisualSearch\Domain\Repository\SearchableRepositoryInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Flow\Persistence\QueryInterface;

/**
 * @Flow\Scope("singleton")
 *
 * this service is used to retrieve the autocomplete values for a given facet
 */
class ValueService
{
    /**
     * @var \KayStrobach\VisualSearch\Domain\Repository\FacetRepository
     * @Flow\Inject
     */
    protected $facetRepository;

    /**
     * @var \KayStrobach\VisualSearch\Domain\Repository\SearchRepository
     * @Flow\Inject
     */
    protected $searchRepository;

    /**
     * @var \Neos\Flow\ObjectManagement\ObjectManager
     * @Flow\Inject
     */
    protected $objectManager;

    /**
     * @Flow\Inject
     *
     * @var PersistenceManagerInterface
     */
    protected $persistenceManager;

    /**
     * @param string $searchName
     * @param string $facet
     * @param array  $query
     * @param string $term
     *
     * @return array
     */
    public function getValuesByFacetQueryAndTerm($searchName, $facet, $query, $term)
    {
        $facetConfiguration = $this->facetRepository->findBySearchNameAndFacetName($searchName, $facet);
        $values = [];

        if (!isset($facetConfiguration)) {
            return [];
        }

        $stringLength = isset($facetConfiguration['display']['maxLength']) ? $facetConfiguration['display']['maxLength'] : 30;
        if (isset($facetConfiguration['selector']['values'])) {
            $values = $this->convertArrayForSearch($facetConfiguration['selector']['values']);

            return array_values(array_filter($values, function ($value) use ($term) {
                return (stripos($value['label'], $term) !== false || stripos($value['value'], $term) !== false);
            }));
        }

        if (isset($facetConfiguration['selector']['repository'])) {
            /** @var \Neos\Flow\Persistence\RepositoryInterface|SearchableRepositoryInterface $repository */
            $repository = $this->objectManager->get($facetConfiguration['selector']['repository']);
            if ($repository instanceof SearchableRepositoryInterface) {
                // find by search term, labelProperty, etc
                // @todo think about replacing the labelProperty with the whole config array
                $result = $repository->findBySearchTerm(
                    $query,
                    $term,
                    $facetConfiguration['selector'],
                    $this->searchRepository->findByName($searchName)['autocomplete']
                );
                $entities = $result;
                if (is_array($result)) {
                    return $this->convertEntitiesForSearch($result, $facetConfiguration, $stringLength);
                }
                if (method_exists($result, 'getQuery')) {
                    $limit = $facetConfiguration['selector']['limit'] ?? 10;
                    $entities = $result->getQuery()->setLimit($limit)->execute(true);
                }
                return $this->convertEntitiesForSearch($entities, $facetConfiguration, $stringLength);
            }
            if (isset($facetConfiguration['selector']['orderBy'])) {
                return $this->convertEntitiesForSearch(
                    $repository->findAll()->getQuery()->setOrderings(
                        [$facetConfiguration['selector']['orderBy']  => QueryInterface::ORDER_ASCENDING]
                    )->execute(),
                    $facetConfiguration,
                    $stringLength
                );
            }

            return $this->convertEntitiesForSearch(
                $repository->findAll(),
                $facetConfiguration,
                $stringLength
            );
        }

        return $values;
    }

    /**
     * @param $array
     *
     * @return array
     */
    protected function convertArrayForSearch($array)
    {
        $values = [];
        foreach ($array as $key => $value) {
            $values[] = ['label' => $value, 'value' => $key];
        }

        return $values;
    }

    /**
     * @param array|\Iterator $entities
     * @param array $facetConfiguration
     * @param int $labelLength
     *
     * @return array
     * @throws \Neos\Utility\Exception\PropertyNotAccessibleException
     */
    protected function convertEntitiesForSearch($entities, $facetConfiguration, $labelLength)
    {
        $values = [];
        foreach ($entities as $entity) {
            if (is_string($entity)) {
                $values[] = array(
                    'label' => $entity,
                    'value' => $entity
                );
                continue;
            }
            if (isset($facetConfiguration['display']['labelProperty'])) {
                $label = \Neos\Utility\ObjectAccess::getPropertyPath(
                    $entity,
                    $facetConfiguration['display']['labelProperty']
                );
            } elseif (isset($facetConfiguration['selector']['labelProperty'])) {
                $label = \Neos\Utility\ObjectAccess::getPropertyPath(
                    $entity,
                    $facetConfiguration['selector']['labelProperty']
                );
            } elseif (method_exists($entity, '__toString')) {
                $label = (string) $entity;
            } else {
                $label = $this->persistenceManager->getIdentifierByObject($entity);
            }

            $values[] = [
                'label' => $this->shortenString($label, $labelLength),
                'value' => $this->persistenceManager->getIdentifierByObject($entity),
            ];
        }

        return $values;
    }

    /**
     * @param $string
     * @param string $length
     * @param string $append
     *
     * @return string
     */
    protected function shortenString($string, $length = '30', $append = '...')
    {
        if (strlen($string) <= $length) {
            return $string;
        }
        return mb_substr($string, 0, $length).$append;
    }
}
