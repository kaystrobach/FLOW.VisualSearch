<?php

namespace KayStrobach\VisualSearch\Demands;

class EqualsDemand extends AbstractDemand
{
    /**
     * @param mixed $value
     * @return object
     */
    public function getDemands($value)
    {
        $subDemands = [];
        foreach ($this->fields as $matchField) {
            $subDemands[] = $this->query->equals($matchField, $value);
        }
        return $this->query->logicalOr($subDemands);
    }
}
