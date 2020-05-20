import React from 'react';
import { shallow } from 'enzyme';
import { PageNotFound } from '../PageNotFound';

describe('PageNotFound Component', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<PageNotFound pageNotFound={()=> {}}/>);
        expect(wrapper).toMatchSnapshot();
    })

    it('calls componentDidMount once', () => {
        const componentDidMountSpy = jest.spyOn(PageNotFound.prototype, 'componentDidMount');

        const wrapper = shallow(<PageNotFound pageNotFound={()=> {}}/>);

        expect(PageNotFound.prototype.componentDidMount).toHaveBeenCalledTimes(1);

        componentDidMountSpy.mockClear();
    })
    it('dispatches an action on load indicating 404 load', () => {
        const mockFn = jest.fn()
        const wrapper = shallow(<PageNotFound pageNotFound={mockFn}/>);
        expect(mockFn).toHaveBeenCalledTimes(1);
    })
})