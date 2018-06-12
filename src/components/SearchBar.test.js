import React from 'react';
import { shallow } from 'enzyme';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  it('renders without crashing', () => {
    shallow(<SearchBar />);
  });

  it('renders correctly', () => {
    const wrapper = shallow(<SearchBar />);
    expect(wrapper).toMatchSnapshot();
  })

  it('executes searches on submit', () => {
    const mockFn = jest.fn()
    const wrapper = shallow(<SearchBar onSubmit={mockFn} />);
    wrapper.find('.searchbar__container').simulate('submit', { preventDefault() {} });
    expect(mockFn.mock.calls.length).toBe(1);
  })

  //TODO: When the issue with finding 'input is resolved, test onChange function
})