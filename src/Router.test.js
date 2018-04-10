import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router-dom';
import Router from './Router';
import Home from './views/home';
import Results from './views/results';
import Resource from './views/resource';

it('renders without crashing', () => {
  shallow(<Router />);
});

// Until I figure out testing dynamic routing in a shallow render, this will demonstrate a 
// simpler test without a params id or asterix.
it('renders the correct static route', () => {
  const wrapper = shallow(<Router />);
  const pathMap = wrapper.find(Route).reduce((pathMap, route) => {
    const routeProps = route.props();
    pathMap[routeProps.path] = routeProps.component;
    return pathMap;
  }, {});

  expect(pathMap['/r4r/search']).toBe(Results);
});