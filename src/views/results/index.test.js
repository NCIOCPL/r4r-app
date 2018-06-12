import React from 'react';
import { shallow } from 'enzyme';
import { Results } from './index';

// TODO: window.matchmedia means we need to use jsdom to provide a window for even smoke
describe('Results view', () => {
  beforeAll(() => {  
    Object.defineProperty(window, "matchMedia", {
      value: jest.fn(() => ({ matches: true, addListener: () => {} }) )
    });
  });

  it('renders without crashing', () => {
    shallow(<Results location={{}} setCurrentSearchText={() => {}} validatedNewSearch={()=>{}}/>);
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Results location={{search: ''}} setCurrentSearchText={() => {}} validatedNewSearch={()=>{}}/>);
    expect(wrapper).toMatchSnapshot();
  })
})
