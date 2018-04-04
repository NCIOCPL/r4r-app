import React from 'react';
import { shallow } from 'enzyme';
import BrowseTile from './BrowseTile';

it('renders without crashing', () => {
  shallow(<BrowseTile />);
});