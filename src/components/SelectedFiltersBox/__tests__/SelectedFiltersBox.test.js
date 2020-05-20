import React from 'react';
import { shallow } from 'enzyme';
import SelectedFiltersBox from '../SelectedFiltersBox';

describe('SelectedFiltersBox Component', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<SelectedFiltersBox toggleFilter={()=> {}} clearFilters={() => {}}/>);
    expect(wrapper).toMatchSnapshot();
  })
})