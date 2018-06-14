import React from 'react';
import { shallow } from 'enzyme';
import ContactInformation from './ContactInformation';

describe('ContactInfomation Component', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<ContactInformation />);
    expect(wrapper).toMatchSnapshot();
  })
})