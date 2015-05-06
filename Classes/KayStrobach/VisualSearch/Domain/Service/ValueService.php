<?php
/**
 * Created by PhpStorm.
 * User: kay
 * Date: 06.05.15
 * Time: 18:12
 */

namespace KayStrobach\VisualSearch\Domain\Service;
use KayStrobach\VisualSearch\Domain\Repository\SearchableRepositoryInterface;
use TYPO3\Flow\Persistence\QueryInterface;
use TYPO3\Flow\Persistence\PersistenceManagerInterface;
use TYPO3\Flow\Annotations as Flow;


/**
 * @Flow\Scope("singleton")
 *
 * this service is used to retrieve the autocomplete values for a given facet
 */
class ValueService {
	/**
	 * @var \KayStrobach\VisualSearch\Domain\Repository\FacetRepository
	 * @Flow\Inject
	 */
	public $facetRepository;

	/**
	 * @var \TYPO3\Flow\Object\ObjectManager
	 * @Flow\Inject
	 */
	protected $objectManager;

	/**
	 * @Flow\Inject
	 * @var PersistenceManagerInterface
	 */
	protected $persistenceManager;

	/**
	 * @param string $searchName
	 * @param string $facet
	 * @param array $query
	 * @param string $term
	 *
	 * @return array
	 */
	public function getValuesByFacetQueryAndTerm($searchName, $facet, $query, $term) {
		$facetConfiguration = $this->facetRepository->findBySearchNameAndFacetName($searchName, $facet);
		$values = array();

		if (isset($facetConfiguration)) {
			$stringLength = isset($facetConfiguration['labelLength']) ? $facetConfiguration['labelLength'] : 30;

			if(isset($facetConfiguration['selector']['values'])) {
				return $this->convertArrayForSearch($facetConfiguration['selector']['values']);
			} elseif(isset($facetConfiguration['selector']['repository'])) {
				/** @var \TYPO3\Flow\Persistence\RepositoryInterface|SearchableRepositoryInterface $repository */
				$repository = $this->objectManager->get($facetConfiguration['selector']['repository']);
				if ($repository instanceOf SearchableRepositoryInterface) {
					// find by search term, labelProperty, etc
					// @todo think about replacing the labelProperty with the whole config array
					$result = $repository->findBySearchTerm(
						$query,
						$term,
						$facetConfiguration['selector'],
						$facetConfiguration
					);
					if(method_exists($result, 'getQuery')) {
						$entities = $result->getQuery()->setLimit(10)->execute(TRUE);
					} else {
						$entities = $result;
					}
				} else {
					if(isset($facetConfiguration['selector']['orderBy'])) {
						$entities = $repository->findAll()->getQuery()->setOrderings(
							array($facetConfiguration['selector']['orderBy']  => QueryInterface::ORDER_ASCENDING)
						)->execute(TRUE);
					} else {
						$entities = $repository->findAll();
					}

				}
				foreach($entities as $key => $entity) {
					if(method_exists($entity, '__toString')) {
						$values[] = array(
							'label' => (string)$entity,
							'value' => $this->shortenString($this->persistenceManager->getIdentifierByObject($entity), $stringLength)
						);
					} else {
						$label = $this->shortenString(
							\TYPO3\Flow\Reflection\ObjectAccess::getPropertyPath(
								$entity,
								$facetConfiguration['selector']['labelProperty']
							)
						);
						$values[] = array(
							'label' => $label,
							'value' => $this->persistenceManager->getIdentifierByObject($entity)
						);
					}
				}
			}
		}
		return $values;
	}

	/**
	 * @param $array
	 * @return array
	 */
	protected function convertArrayForSearch($array) {
		$values = array();
		foreach($array as $key => $value) {
			$values[] = array('label' => $value, 'value' => $key);
		}
		return $values;

	}

	/**
	 * @param $string
	 * @param string $length
	 * @param string $append
	 * @return string
	 */
	protected function shortenString($string, $length = '30', $append = '...') {
		if(strlen($string) <= $length) {
			return $string;
		} else {
			return substr($string, 0, $length) . $append;
		}
	}
}