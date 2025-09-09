<?php
namespace Poke\Search\Controller;

/*
 * This file is part of the Happy.Coding package.
 */

use KayStrobach\VisualSearch\Domain\Session\QueryDto;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ActionController;

class StandardController extends ActionController
{
    /**
     * @Flow\Inject
     * @var \Poke\Search\Domain\Repository\PokemonRepository
     */
    protected $pokemonRepository;

    /**
     * @return void
     * @param array $query
     */
    public function indexAction($query = [])
    {
        // TODO if query is set -> override session storage

        $this->view->assign('foos', array(
            'bar', 'baz'
        ));

        // $this->registerArgument('search', 'string', 'search name', true, '');

        // $this->view->assign('pokemon', $this->pokemonRepository->findAll());
        // $this->view->assign(
        //     'pokemon',
        //     $this->pokemonRepository->findByDefaultQuery()
        // );

        // $this->view->assign(
        //     'pokemon',
        //     $this->pokemonRepository->findByQuery()
        // );

        // TODO class QueryDto_Original implements \JsonSerializable
        // JSON query vs url_encoding -> use url_encoding since GET request are used for autocompletion

        // $this->queryStorage->setQuery(
        //     QueryDto::fromArray($query)
        // );

        // TODO QueryDto form form encoded data
        // even allows to share searches via url

        // form encoded data can be stored in local storage

        // TODO how to automatically retrieve query from session
        // TODO even possible without widget

        if (!empty($query)) {
            $this->view->assign(
                'pokemon',
                $this->pokemonRepository->findByQuery(QueryDto::fromArray($query), 'pokemon')
            );
        } else {
            $this->view->assign(
                'pokemon',
                $this->pokemonRepository->findByDefaultQuery()
            );
        }
    }
}
