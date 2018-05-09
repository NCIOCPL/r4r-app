import React from 'react';
import { shallow } from 'enzyme';
import NoTouch from './NoTouch';

it('renders without crashing', () => {
  shallow(<NoTouch />);
});