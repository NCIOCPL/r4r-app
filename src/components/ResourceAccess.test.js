import React from 'react';
import { shallow } from 'enzyme';
import ResourceAccess from './ResourceAccess';

it('renders without crashing', () => {
  shallow(<ResourceAccess />);
});