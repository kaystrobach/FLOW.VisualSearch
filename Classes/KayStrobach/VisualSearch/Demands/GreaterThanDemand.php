<?php

namespace KayStrobach\VisualSearch\Demands;

class GreaterThanDemand extends AbstractDemand
{

    /**
     * @param mixed $value
     * @return object
     */
    public function getDemands($value)
    {
        $subDemands = [];
        foreach ($this->fields as $matchField) {
            $subDemands[] = $this->query->greaterThan($matchField, $value);
        }
        return $this->query->logicalOr($subDemands);
    }
}
