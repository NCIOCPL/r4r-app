import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router-dom';
import Router from './Router';
import Home from './views/home';
import Results from './views/results';
import Resource from './views/resource';

it('renders without crashing', () => {
  shallow(<Router history={{}} />);
});