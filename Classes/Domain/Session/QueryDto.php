<?php

namespace KayStrobach\VisualSearch\Domain\Session;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

class QueryDto
{
    /**
     * @var string
     */
    protected $identifier;

    /**
     * @var Collection<Facet>
     */
    protected $facets;

    /**
     * @var string
     */
    protected $sorting;

    public function __construct()
    {
        $this->identifier = '';
        $this->facets = new ArrayCollection();
        $this->sorting = '';
    }

    public function getIdentifier()
    {
        return $this->identifier;
    }

    /**
     * @param Collection<Facet> $facets
     */
    public function setFacets(Collection $facets)
    {
        $this->facets = $facets;
    }

    public function getFacets(): Collection
    {
        return $this->facets;
    }

    /**
     * @param string|null $sorting
     */
    public function setSorting(string $sorting = null)
    {
        $this->sorting = $sorting;
    }

    public function getSorting(): ?string
    {
        return $this->sorting;
    }

    public static function fromArray(array $array): self
    {
        $o = new static();
        $o->setSorting($array['sorting'] ?? '');
        if (isset($array['facets']) && is_array($array['facets'])) {
            foreach ($array['facets'] as $facet) {
                $facetObject = new Facet();
                $facetObject->setFacet($facet['facet']);
                $facetObject->setFacetLabel($facet['facetLabel']);
                $facetObject->setValue($facet['value']);
                $facetObject->setValueLabel($facet['valueLabel']);
                $o->getFacets()->add($facetObject);
            }
        }
        return $o;
    }
}
