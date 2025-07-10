<?php

namespace KayStrobach\VisualSearch\Domain\Repository;

use KayStrobach\VisualSearch\Domain\Model\Facet;
use KayStrobach\VisualSearch\Utility\ArrayUtility;
use Neos\Flow\Annotations as Flow;

/**
 * @Flow\Scope("singleton")
 *
 * plan is to refactor to the controller to get all the facets from this repo
 * instead of doing that directly in the controller
 */
class FacetRepository
{
    /**
     * @var \Neos\Flow\Configuration\ConfigurationManager
     * @Flow\Inject
     */
    public $configurationManager;

    /**
     * Extracts the facets from the Configuration Files.
     *
     * @param string $searchName
     * @param array  $query
     * @param string $term
     *
     * @return array
     */
    public function findFacetsByQueryAndTerm($searchName, $query, $term)
    {
        $facetsFromConfiguration = $this->configurationManager->getConfiguration(
            'VisualSearch',
            'Searches.'.$searchName.'.autocomplete'
        );
        $facets = [];
        $lowerCasedTerm = strtolower($term);
        if ((is_array($facetsFromConfiguration)) && (count($facetsFromConfiguration) > 0)) {
            foreach ($facetsFromConfiguration as $key => $value) {
                $label = isset($value['label']) ? $value['label'] : $key;
                $inputType = isset($value['inputType']) ? $value['inputType'] : 'text';

                // restrict to items filtered by term
                if (($term === '')
                    || (strtolower(substr($label, 0, strlen($lowerCasedTerm))) === $lowerCasedTerm)
                    || (strtolower(substr($key, 0, strlen($lowerCasedTerm))) === $lowerCasedTerm)
                    || $key === 'freetext'
                ) {
                    // should item be displayed just once?
                    if ((!isset($value['selector']['conditions']['once']))
                        || (($value['selector']['conditions']['once']) && (!ArrayUtility::hasSubEntryWith($query, 'facet', $key)))) {
                        // are all required fields given?
                        if ((!isset($value['selector']['conditions']['conflicts']))
                            || ((is_array($value['selector']['conditions']['conflicts'])) && (!ArrayUtility::hasAllSubentries($query, 'facet', $value['selector']['conditions']['conflicts'])))) {
                            if ((!isset($value['selector']['conditions']['requires']))
                                || ((is_array($value['selector']['conditions']['requires'])) && (ArrayUtility::hasAllSubentries($query, 'facet', $value['selector']['conditions']['requires'])))) {
                                $facets[] = new Facet(
                                    $label,
                                    $key,
                                    $value['selector'],
                                    $inputType,
                                );
                            }
                        }
                    }
                }
            }
            usort($facets, function (Facet $a, Facet $b) {
                $labelA = mb_strtolower($a->getLabel());
                $labelB = mb_strtolower($b->getLabel());

                return strnatcmp($labelA, $labelB);
            });
        }

        return $facets;
    }

    /**
     * return a facet by search and facet.
     *
     * @param $searchName
     * @param $facet
     *
     * @return array
     */
    public function findBySearchNameAndFacetName($searchName, $facet)
    {
        return $this->configurationManager->getConfiguration(
            'VisualSearch',
            'Searches.'.$searchName.'.autocomplete.'.$facet
        );
    }
}
