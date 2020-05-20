import React from 'react';
import { shallow } from 'enzyme';
import NoTouch from '../NoTouch';

describe('NoTouch Component', () => {

  it('renders correctly', () => {
    const wrapper = shallow(<NoTouch/>);
    expect(wrapper).toMatchSnapshot();
  })
})