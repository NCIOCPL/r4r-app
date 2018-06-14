import React from 'react';
import { shallow } from 'enzyme';
import Filters from './Filters';

describe('Filters Component', () => {

  it('renders correctly', () => {
    const wrapper = shallow(<Filters/>);
    expect(wrapper).toMatchSnapshot();
  })
})