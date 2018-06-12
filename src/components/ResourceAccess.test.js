import React from 'react';
import { shallow } from 'enzyme';
import ResourceAccess from './ResourceAccess';

describe('ResourceAccess Component', () => {
  it('renders without crashing', () => {
    shallow(<ResourceAccess type="open" />);
  });

  it('renders correctly', () => {
    const wrapper = shallow(<ResourceAccess type="open" />);
    expect(wrapper).toMatchSnapshot();
  })

})