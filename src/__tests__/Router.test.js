import React from 'react';
import { shallow } from 'enzyme';
import Router from '../Router';

describe('Router Container', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Router history={{}}/>);
    expect(wrapper).toMatchSnapshot();
  })
})
