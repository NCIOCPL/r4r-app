import React from 'react';
import { shallow } from 'enzyme';
import CheckFilter from './CheckFilter';

describe('CheckFilter Component', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<CheckFilter />);
    expect(wrapper).toMatchSnapshot();
  })

  it('handles change events to checkbox', () => {
    const mockFn = jest.fn();
    const wrapper = mountWithTheme(<CheckFilter onChange={ mockFn }/>);
    wrapper.find('input').simulate('change');
    expect(mockFn).toHaveBeenCalledTimes(1);
  })
})