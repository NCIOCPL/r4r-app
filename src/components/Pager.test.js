import React from 'react';
import { shallow } from 'enzyme';
import Pager from './Pager';

it('renders without crashing', () => {
  shallow(<Pager />);
});