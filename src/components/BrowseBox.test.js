import React from 'react';
import { shallow } from 'enzyme';
import BrowseBox from './BrowseBox';

describe('BrowseBox Component', () => {
  it('renders without crashing', () => {
    shallow(<BrowseBox />);
  });

  it('renders correctly', () => {
    const wrapper = shallow(<BrowseBox />);
    expect(wrapper).toMatchSnapshot();
  })

})
