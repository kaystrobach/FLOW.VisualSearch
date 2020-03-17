<?php
/**
 * Created by kay.
 */

namespace KayStrobach\VisualSearch\Demands;


class InstanceOfDemand extends AbstractDemand
{

    /**
     * @inheritDoc
     */
    public function getDemands($value)
    {
        return $this->query->getQueryBuilder()->expr()->isInstanceOf(
            $this->query->getQueryBuilder()->getRootAliases()[0],
            $value
        );
    }
}
