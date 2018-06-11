import React from 'react';
import { shallow } from 'enzyme';
import { NavigationHandler } from './NavigationHandler';

it('renders without crashing', () => {
  shallow(<NavigationHandler />);
});