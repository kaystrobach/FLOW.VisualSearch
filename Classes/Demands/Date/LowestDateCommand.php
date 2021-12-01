<?php

namespace KayStrobach\VisualSearch\Demands\Date;

use KayStrobach\VisualSearch\Demands\AbstractDemand;

class LowestDateCommand extends AbstractDemand
{
    /**
     * @inheritDoc
     *
     * @param mixed $value
     * @return object|null
     * @throws \Neos\Flow\Persistence\Exception\InvalidQueryException
     */
    public function getDemands($value)
    {
        $subDemands = [];
        $dateStartObject = \DateTime::createFromFormat(
            $this->selectorOptions['dateFormat'] ?? 'd.m.Y',
            $value
        );
        if (!$dateStartObject instanceof \DateTime) {
            return null;
        }
        $dateStartObject->setTime(0, 0);

        foreach ($this->fields as $matchField) {
            $subDemands[] =$this->query->greaterThanOrEqual($matchField, $dateStartObject);
        }
        return $this->query->logicalOr($subDemands);
    }
}
