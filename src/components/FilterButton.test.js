import React from 'react';
import { shallow } from 'enzyme';
import FilterButton from './FilterButton';

describe('FilterButton Component', () => {

  it('renders correctly', () => {
    const wrapper = shallow(<FilterButton filtersCount={2} />);
    expect(wrapper).toMatchSnapshot();
  })
})