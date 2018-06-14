import React from 'react';
import { shallow } from 'enzyme';
import BrowseTile from './BrowseTile';

describe('BrowseTile Component', () => {

  it('renders correctly', () => {
    const wrapper = shallow(<BrowseTile label="Test" count={4} displayCount={true}/>);
    expect(wrapper).toMatchSnapshot();
  })
})