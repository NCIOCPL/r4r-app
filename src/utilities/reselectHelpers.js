import { createSelector } from 'reselect';
import { 
    formatFilters,
    formatRawResourcesFacets,
    getCurrentlySelectedFiltersFromFacets,
} from './index';

// Format Filters for Related Resources in Resource view.
export const memoizeFilters = createSelector(
    state => state.currentResource,
    resource => formatFilters(resource)
)

// Retrieve selected filters in Results view.
export const memoizeSelectedFilters = createSelector(
    state => state.currentFacets,
    facets => getCurrentlySelectedFiltersFromFacets(formatRawResourcesFacets(facets))
)

// Format facet filters for display in Results view.
export const memoizeFacetFilters = createSelector(
    state => state.currentFacets,
    facets => formatRawResourcesFacets(facets)
)

// Format facet types used in Home view.
export const memoizeReferenceFacets = createSelector(
    state => state.referenceFacets,
    facets => formatRawResourcesFacets(facets)
)