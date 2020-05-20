import React from 'react';
import { shallow } from 'enzyme';
import { NavigationHandler } from '../NavigationHandler';

window.scrollTo = () => {}

describe('NavigationHandler HOC', () => {

  it('renders correctly', () => {
    const wrapper = shallow(<NavigationHandler />);
    expect(wrapper).toMatchSnapshot();
  })

  it('should clear an error when the user navigates to a new location', () => {
    const clearError = jest.fn();
    const wrapper = shallow(<NavigationHandler clearError={clearError} location="first" error={true}/>)
    wrapper.setProps({location: "second"});
    expect(clearError.mock.calls.length).toBe(1);
  })

})