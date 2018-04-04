import React from 'react';
import { shallow } from 'enzyme';
import MultiLineText from './MultiLineText';

it('renders without crashing', () => {
  shallow(<MultiLineText />);
});