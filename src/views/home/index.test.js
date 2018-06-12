import React from 'react';
import { shallow } from 'enzyme';
import { Home } from './index';

describe('Home View', () => {
  it('renders without crashing', () => {
    shallow(<Home loadFacets={() => {}} />);
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Home loadFacets={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  })
})
