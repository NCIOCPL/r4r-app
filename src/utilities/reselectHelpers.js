import { createSelector } from 'reselect';
import { 
    formatFilters,
    getCurrentlySelectedFiltersFromFacets,
} from './index';

// Format Filters for Related Resources in Resource view.
export const memoizeFilters = createSelector(
    state => state.currentResource,
    resource => formatFilters(resource)
)

// Retrieve selected filters for Results view.
export const memoizeSelectedFilters = createSelector(
    state => state.currentFacets,
    facets => getCurrentlySelectedFiltersFromFacets(facets)
)