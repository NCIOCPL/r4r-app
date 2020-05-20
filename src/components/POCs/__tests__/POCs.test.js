import React from 'react';
import { shallow } from 'enzyme';
import POCs from '../POCs';

describe('POCs Component', () => {
  it('renders correctly without poC', () => {
    const wrapper = shallow(<POCs />);
    expect(wrapper).toMatchSnapshot();
})

it('renders correctly with poC', () => {
    const example = {
        name: {
            prefix: 'Mr',
            firstName: 'Franklin',
            middleName: 'Delano',
            lastName: 'Roosevelt',
            suffix: 'III',
        },
        title: 'Senor',
        phone: '123-555-5555',
        email: 'waitingforgodot@gmail.com',
    }
    const wrapper = shallow(<POCs poCs={[example]}/>)
    expect(wrapper).toMatchSnapshot();
  })
})