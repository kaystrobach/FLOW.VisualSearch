<?php

namespace KayStrobach\VisualSearch\Demands\Date;

use KayStrobach\VisualSearch\Demands\AbstractDemand;

class HighestDateDemand extends AbstractDemand
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
        $dateEndObject = \DateTime::createFromFormat(
            $this->selectorOptions['dateFormat'] ?? 'd.m.Y',
            $value
        );
        if (!$dateEndObject instanceof \DateTime) {
            return null;
        }
        $dateEndObject->setTime(23, 59, 59);

        foreach ($this->fields as $matchField) {
            $subDemands[] = $this->query->lessThanOrEqual($matchField, $dateEndObject);
        }
        return $this->query->logicalOr($subDemands);
    }
}
