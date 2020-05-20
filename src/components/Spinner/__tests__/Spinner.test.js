import React from 'react';
import { shallow } from 'enzyme';
import Spinner from '../';

describe('CTS_Spinner Component', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<Spinner/>);
        expect(wrapper).toMatchSnapshot();
    })
})