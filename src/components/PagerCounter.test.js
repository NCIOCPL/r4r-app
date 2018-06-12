import React from 'react';
import { shallow } from 'enzyme';
import PagerCounter from './PagerCounter';

describe('PagerCounter Component', () => {
  it('renders without crashing', () => {
    shallow(<PagerCounter from={0} to={0} total={0} />);
  });

  it('renders correctly', () => {
    const wrapper = shallow(<PagerCounter from={0} to={20} total={100} />);
    expect(wrapper).toMatchSnapshot();
  })
})