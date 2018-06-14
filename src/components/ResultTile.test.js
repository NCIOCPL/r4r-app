import React from 'react';
import { shallow } from 'enzyme';
import ResultTile from './ResultTile';

describe('ResultTile Component', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<ResultTile id={1} />);
    expect(wrapper).toMatchSnapshot();
  })

  it('appends a click handler to the result link', () => {
    const fn = jest.fn()
    const wrapper = shallow(<ResultTile id={1} onClick={fn}/>);
    wrapper.find('Link').simulate('click');
    expect(fn.mock.calls.length).toBe(1);
  })
})