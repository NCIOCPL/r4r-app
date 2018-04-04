import React from 'react';
import { shallow } from 'enzyme';
import BrowseBox from './BrowseBox';

it('renders without crashing', () => {
  shallow(<BrowseBox />);
});
