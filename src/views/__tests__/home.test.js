import React from 'react';
import { shallow } from 'enzyme';
import { Home } from '../home';
import { memoizeReferenceFacets } from '../../utilities/reselectHelpers';

describe('Home View', () => {
  it('renders correctly without facets', () => {
    const wrapper = shallow(<Home loadFacets={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  })

  it('renders correctly with facets', () => {
    const wrapper = mountWithThemeAndRouter(<Home facets={ mockFacets } loadFacets={() => {} }/>)
    expect(wrapper).toMatchSnapshot();
  })

  it('calls componentDidMount once', () => {
    const componentDidMountSpy = jest.spyOn(Home.prototype, 'componentDidMount');
    const wrapper = shallow(<Home loadFacets={() => {}} />);
    expect(Home.prototype.componentDidMount).toHaveBeenCalledTimes(1);
    componentDidMountSpy.mockClear();
  })

  it('calls loadFacets on load', () => {
    const mockFn = jest.fn();
    const wrapper = shallow(<Home loadFacets={ mockFn } />);
    expect(mockFn).toHaveBeenCalledTimes(1);
  })
  
  it('calls new search for view all', () => {
    const mockSearch = jest.fn();
    const mockEvent = jest.fn();
    const wrapper = shallow(<Home loadFacets={ ()=> {} } newSearch={ mockSearch } clickEvent={ mockEvent}/>);
    const viewAll = wrapper.find('.view-all__link').simulate('click', { preventDefault(){}})
    expect(mockSearch).toHaveBeenCalledTimes(1);
    expect(mockEvent).toHaveBeenCalledTimes(1);
  })

  it('calls new search for text search', () => {
    const mockSearch = jest.fn();
    const mockEvent = jest.fn();
    const wrapper = shallow(<Home loadFacets={ ()=> {} } newSearch={ mockSearch } clickEvent={ mockEvent} searchBarValue="Test"/>);
    const searchBar = wrapper.find('SearchBar').simulate('submit', { preventDefault(){}})
    expect(mockSearch).toHaveBeenCalledTimes(1);
    expect(mockEvent).toHaveBeenCalledTimes(1);
  })
})

const mockFacets = memoizeReferenceFacets({ api: { facets: [
  {
    title: 'Tool Types',
    param: 'toolTypes',
    items: [
      {
        key: 'analysis_tools',
        label: 'Analysis Tools',
        count: 98,
        selected: false
      },
      {
        key: 'datasets_databases',
        label: 'Datasets & Databases',
        count: 58,
        selected: false
      },
      {
        key: 'lab_tools',
        label: 'Lab Tools',
        count: 29,
        selected: false
      },
      {
        key: 'terminology',
        label: 'Terminology',
        count: 6,
        selected: false
      },
      {
        key: 'networks_consortiums',
        label: 'Networks/Consortiums',
        count: 4,
        selected: false
      },
      {
        key: 'clinical_research_tools',
        label: 'Clinical Research Tools',
        count: 2,
        selected: false
      },
      {
        key: 'community_research_tools',
        label: 'Community Research Tools',
        count: 1,
        selected: false
      }
    ]
  },
  {
    title: 'Research Areas',
    param: 'researchAreas',
    items: [
      {
        key: 'cancer_treatment',
        label: 'Cancer Treatment',
        count: 73,
        selected: false
      },
      {
        key: 'cancer_omics',
        label: 'Cancer Omics',
        count: 63,
        selected: false
      },
      {
        key: 'cancer_biology',
        label: 'Cancer Biology',
        count: 62,
        selected: false
      },
      {
        key: 'screening_detection',
        label: 'Screening & Detection',
        count: 30,
        selected: false
      },
      {
        key: 'cancer_statistics',
        label: 'Cancer Statistics',
        count: 20,
        selected: false
      },
      {
        key: 'cancer_health_disparities',
        label: 'Cancer Health Disparities',
        count: 18,
        selected: false
      },
      {
        key: 'cancer_public_health',
        label: 'Cancer & Public Health',
        count: 16,
        selected: false
      },
      {
        key: 'cancer_diagnosis',
        label: 'Cancer Diagnosis',
        count: 12,
        selected: false
      },
      {
        key: 'causes_of_cancer',
        label: 'Causes of Cancer',
        count: 5,
        selected: false
      },
      {
        key: 'cancer_survivorship',
        label: 'Cancer Survivorship',
        count: 4,
        selected: false
      },
      {
        key: 'cancer_prevention',
        label: 'Cancer Prevention',
        count: 2,
        selected: false
      }
    ]
  }
]}})
