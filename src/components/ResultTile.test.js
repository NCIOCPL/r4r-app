import React from 'react';
import { shallow } from 'enzyme';
import ResultTile from './ResultTile';

it('renders without crashing', () => {
  shallow(<ResultTile />);
});