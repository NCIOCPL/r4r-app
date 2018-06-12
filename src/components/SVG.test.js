import React from 'react';
import { shallow } from 'enzyme';
import SVG, { images } from './SVG';

describe('SVG Component', () => {
    it('renders without crashing', () => {
        shallow(<SVG iconType=""/>)
    })

    it('renders correctly', () => {
        const image = Object.keys(images)[0]
        const wrapper = shallow(<SVG iconType={image}/>)
        expect(wrapper).toMatchSnapshot();
    })
})