import React from 'react';
import { shallow } from 'enzyme';
import SelectedFiltersBox from './SelectedFiltersBox';

it('renders without crashing', () => {
  shallow(<SelectedFiltersBox />);
});