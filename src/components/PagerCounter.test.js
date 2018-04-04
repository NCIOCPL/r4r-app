import React from 'react';
import { shallow } from 'enzyme';
import PagerCounter from './PagerCounter';

it('renders without crashing', () => {
  shallow(<PagerCounter />);
});