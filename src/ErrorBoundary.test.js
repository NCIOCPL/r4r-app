import React from 'react';
import { shallow } from 'enzyme';
import { ErrorBoundary } from './ErrorBoundary';

describe('Error Boundary', ()=> {
  it('renders without crashing', () => {
    shallow(<ErrorBoundary />);
  });

})