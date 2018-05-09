import React from 'react';
import { shallow } from 'enzyme';
import { LiveRegion } from './LiveRegion';

it('renders without crashing', () => {
  shallow(<LiveRegion />);
});