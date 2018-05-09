import React from 'react';
import { shallow } from 'enzyme';
import Error from './Error';

it('renders without crashing', () => {
  shallow(<Error />);
});