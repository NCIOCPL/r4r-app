import React from 'react';
import { shallow } from 'enzyme';
import CheckFilter from './CheckFilter';

describe('CheckFilter Component', () => {
  it('renders without crashing', () => {
    shallow(<CheckFilter />);
  });

  it('renders correctly', () => {
    const wrapper = shallow(<CheckFilter />);
    expect(wrapper).toMatchSnapshot();
  })
})