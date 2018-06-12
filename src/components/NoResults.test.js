import React from 'react';
import { shallow } from 'enzyme';
import NoResults from './NoResults';

describe('NoResults Component', () => {
  it('renders without crashing', () => {
    shallow(<NoResults />);
  });

  it('renders correctly', () => {
    const wrapper = shallow(<NoResults/>);
    expect(wrapper).toMatchSnapshot();
  })
})