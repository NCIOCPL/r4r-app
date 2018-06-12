import React from 'react';
import { shallow } from 'enzyme';
import { LiveRegion } from './LiveRegion';

describe('LiveRegion Component', () => {
  it('renders without crashing', () => {
    shallow(<LiveRegion />);
  });

  it('renders correctly with a message prop', () => {
    const wrapper = shallow(<LiveRegion message="Hello!"/>);
    expect(wrapper).toMatchSnapshot();
  })
})