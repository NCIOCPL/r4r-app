import React from 'react';
import { shallow } from 'enzyme';
import { Resource } from './index';

describe('Resource View', () => {
  it('renders without crashing', () => {
    shallow(<Resource match={{params: {}}} fetchResource={() => {}}/>);
  });

  it('renders correctly with no resource', () => {
    const wrapper = shallow(<Resource match={{params: {}}} fetchResource={() => {}}/>);
    expect(wrapper).toMatchSnapshot();
  })
  
})
