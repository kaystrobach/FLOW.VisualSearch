<?php

namespace KayStrobach\VisualSearch\ViewHelpers;

use KayStrobach\VisualSearch\Domain\Repository\SearchRepository;
use Neos\Flow\Annotations as Flow;
use KayStrobach\VisualSearch\Domain\Session\QueryStorage;

class SettingsViewHelper extends \Neos\FluidAdaptor\Core\ViewHelper\AbstractViewHelper
{
    /**
     * @var QueryStorage
     * @Flow\Inject
     */
    protected $queryStorage;

    /**
     * @Flow\Inject
     * @var SearchRepository
     */
    protected $searchRepository;

    public function initializeArguments(): void
    {
        parent::initializeArguments();

        $this->registerArgument('name', 'string', '', true);
        $this->registerArgument('key', 'string', '', true);
    }

    public function render()
    {
        try {
            $queryConfiguration = $this->searchRepository->findByName($this->arguments['name']);

            return match ($this->arguments['key']) {
                'autocomplete' => json_encode($queryConfiguration->getAutocomplete()),
                'sorting' => json_encode($queryConfiguration->getSorting()),
                default => throw new \Exception('unknown configuration key ' . $this->arguments['key']),
            };
        } catch (\Exception $e) {
            return htmlspecialchars(json_encode(['error' => $e->getMessage()]));
        }
    }
}
