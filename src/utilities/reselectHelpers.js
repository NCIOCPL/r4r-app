import { createSelector } from 'reselect';
import { formatFilters } from './index';

// Format Filters for Related Resources in Resource page.
export const memoizeFilters = createSelector(
    state => state.currentResource,
    resource => formatFilters(resource)
)