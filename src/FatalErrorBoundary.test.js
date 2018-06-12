import React from 'react';
import { shallow } from 'enzyme';
import FatalErrorBoundary from './FatalErrorBoundary';

describe('FatalErrorBoundary HOC', () => {
  it('renders without crashing', () => {
    shallow(<FatalErrorBoundary />);
  });

  it('renders correctly with no error', () => {
    const wrapper = shallow(<FatalErrorBoundary />);
    expect(wrapper).toMatchSnapshot();
  })
})