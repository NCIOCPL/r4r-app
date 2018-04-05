import React from 'react';
import { shallow } from 'enzyme';
import PagerCounter from './PagerCounter';

it('renders without crashing', () => {
  shallow(<PagerCounter from={0} to={0} total={0} />);
});