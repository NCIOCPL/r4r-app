import React from 'react';
import { shallow } from 'enzyme';
import Pager from './Pager';

describe('Pager Component', () => {
  it('renders without crashing', () => {
    shallow(<Pager />);
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Pager total={100} resultsSize={20} />);
    expect(wrapper).toMatchSnapshot();
  })
})