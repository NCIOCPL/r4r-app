import React from 'react';
import { shallow } from 'enzyme';
import SearchBar from '../SearchBar';

describe('SearchBar Component', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<SearchBar />);
    expect(wrapper).toMatchSnapshot();
  })

  it('executes searches on submit', () => {
    const mockFn = jest.fn()
    const wrapper = mountWithTheme(<SearchBar onSubmit={mockFn} />);
    wrapper.find('form').simulate('submit', { preventDefault() {} });
    expect(mockFn.mock.calls.length).toBe(1);
  })

  it('should update on change with relevant props', () => {
    const mockFn = jest.fn()
    const wrapper = mountWithTheme(<SearchBar onChange={mockFn} page="home"/>);
    wrapper.find('input').simulate('change', { preventDefault() {}, target: {value: 'test' }});
    expect(mockFn.mock.calls.length).toBe(1);
    expect(mockFn.mock.calls[0][0]).toEqual({ page: 'home', value: 'test'})
  })
})