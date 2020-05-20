import React from 'react';
import { shallow } from 'enzyme';
import FilterBox from '../FilterBox';

describe('FilterBox Component', () => {

  it('renders correctly', () => {
    const wrapper = shallow(<FilterBox />);
    expect(wrapper).toMatchSnapshot();
  })
})