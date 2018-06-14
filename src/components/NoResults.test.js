import React from 'react';
import { shallow } from 'enzyme';
import NoResults from './NoResults';

describe('NoResults Component', () => {

  it('renders correctly', () => {
    const wrapper = shallow(<NoResults/>);
    expect(wrapper).toMatchSnapshot();
  })
})