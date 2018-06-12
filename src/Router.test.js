import React from 'react';
import { shallow } from 'enzyme';
import Router from './Router';

describe('Router Container', () => {
  it('renders without crashing', () => {
    shallow(<Router history={{}} />);
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Router history={{}}/>);
    expect(wrapper).toMatchSnapshot();
  })
})
