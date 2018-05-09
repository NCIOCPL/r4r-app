import React from 'react';
import { shallow } from 'enzyme';
import { Resource } from './index';

it('renders without crashing', () => {
  shallow(<Resource match={{params: {}}} fetchResource={() => {}}/>);
});
