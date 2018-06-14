import React from 'react';
import { shallow } from 'enzyme';
import BrowseBox from './BrowseBox';

describe('BrowseBox Component', () => {
  it('renders correctly', () => {
    const wrapper = mountWithTheme(<BrowseBox />);
    expect(wrapper).toMatchSnapshot();
  })

})
