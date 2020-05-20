import React from 'react';
import { shallow } from 'enzyme';
import DOCs from '../DOCs';

describe('DOCs Component', () => {
  it('renders correctly without poC', () => {
    const wrapper = shallow(<DOCs />);
    expect(wrapper).toMatchSnapshot();
})

it('renders correctly with poC', () => {
    const example = [{label: 'Eeinie'}]
    const wrapper = shallow(<DOCs doCs={ example }/>)
    expect(wrapper).toMatchSnapshot();
  })
})