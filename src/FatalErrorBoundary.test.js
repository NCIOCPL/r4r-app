import React from 'react';
import { shallow } from 'enzyme';
import FatalErrorBoundary from './FatalErrorBoundary';

it('renders without crashing', () => {
  shallow(<FatalErrorBoundary />);
});