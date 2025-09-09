<?php

namespace KayStrobach\VisualSearch\Demands;

abstract class LikeDemand extends AbstractDemand
{
    protected $prefix = '';
    protected $postfix = '';

    /**
     * @inheritDoc
     *
     * @param mixed $value
     * @return object
     * @throws \Neos\Flow\Persistence\Exception\InvalidQueryException
     */
    public function getDemands($value)
    {
        $subDemands = [];
        foreach ($this->fields as $matchField) {
            $subDemands[] = $this->query->like(
                $matchField,
                $this->prefix . trim($value) . $this->postfix
            );
        }
        return $this->query->logicalOr($subDemands);
    }
}
