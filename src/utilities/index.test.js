import * as utils from './index';

const rawFacetsFromServer = [
    {
      title: 'Research Areas',
      param: 'researchAreas',
      items: [
        {
          key: 'cancer_biology',
          label: 'Cancer Biology',
          count: 23,
          selected: false
        },
        {
          key: 'cancer_treatment',
          label: 'Cancer Treatment',
          count: 10,
          selected: true
        },
      ]
    },
    {
      title: 'Research Types',
      param: 'researchTypes',
      items: [
        {
          key: 'basic',
          label: 'Basic',
          count: 10,
          selected: false
        },
        {
          key: 'clinical_trials',
          label: 'Clinical Trials',
          count: 7,
          selected: false
        }
      ]
    },
    {
      title: 'Tool Types',
      param: 'toolTypes',
      items: [
        {
          key: 'lab_tools',
          label: 'Lab Tools',
          count: 10,
          selected: true
        }
      ]
    }
];
const formattedRawResources = utils.formatRawResourcesFacets(rawFacetsFromServer);
const selectedFilters = utils.getCurrentlySelectedFiltersFromFacets(formattedRawResources);

describe('composeQueryString()', ()=> {
    it('should return undefined when not provided an object', () => {
        expect(utils.composeQueryString()).toBe(undefined);
        expect(utils.composeQueryString('not an object')).toBe(undefined);
        expect(utils.composeQueryString([])).toBe(undefined);
    });

    it('should return a valid params string', () => {
        const paramsObject = {
            from: 0,
            size: 20
        }
        const expected = '?from=0&size=20';
        expect(utils.composeQueryString(paramsObject)).toBe(expected);
    })

    it('should remove empty q values from string', () => {
        const paramsObject = {
            from: 0,
            size: 20,
            q: ''
        }
        const expected = '?from=0&size=20';
        expect(utils.composeQueryString(paramsObject)).toBe(expected);
    })
})

describe('formatRawResourcesFacets()', () => {
    const facetTypes = ['researchAreas', 'researchTypes', 'toolTypes'];
    

    it('should return an empty array when provided invalid parameter', () => {
        expect(utils.getCurrentlySelectedFiltersFromFacets('catastrophe')).toEqual([]);
    });

    it('should return a map containing keys matching the facet params type of an array of facets', () => {
        const keys = Object.keys(formattedRawResources);
        expect(keys).toEqual(facetTypes);
    });
})

describe('getCurrentlySelectedFiltersFromFacets()', () => {
    it('should return an empty array if provided an invalid parameter', () => {
        expect(utils.getCurrentlySelectedFiltersFromFacets([])).toEqual([]);
        expect(utils.getCurrentlySelectedFiltersFromFacets('helllo')).toEqual([]);
    })

    it('should return an array of filters from a facets object containing filter objects', () => {
        expect(Array.isArray(selectedFilters)).toBe(true);
    });

    it('should return an array of only selected filters', () => {
        expect(selectedFilters.every(({ selected }) => selected)).toBe(true);
    });
})