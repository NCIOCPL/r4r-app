import React from 'react';
import { shallow } from 'enzyme';
import ContactInformation from './ContactInformation';

it('renders without crashing', () => {
  shallow(<ContactInformation />);
});