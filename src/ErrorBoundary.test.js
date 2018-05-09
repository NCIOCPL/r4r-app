import React from 'react';
import { shallow } from 'enzyme';
import { ErrorBoundary } from './ErrorBoundary';

it('renders without crashing', () => {
  shallow(<ErrorBoundary />);
});