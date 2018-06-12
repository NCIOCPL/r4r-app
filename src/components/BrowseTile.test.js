import React from 'react';
import { shallow } from 'enzyme';
import BrowseTile from './BrowseTile';

describe('BrowseTile Component', () => {
  it('renders without crashing', () => {
    shallow(<BrowseTile />);
  });

  it('renders correctly', () => {
    const wrapper = shallow(<BrowseTile />);
    expect(wrapper).toMatchSnapshot();
  })
})