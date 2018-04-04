import React from 'react';
import { shallow } from 'enzyme';
import SearchSpinner from './SearchSpinner';

it('renders without crashing', () => {
  shallow(<SearchSpinner />);
});