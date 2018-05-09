import React from 'react';
import { shallow } from 'enzyme';
import Results from './index';

// TODO: window.matchmedia means we need to use jsdom to provide a window for even smoke

it('renders without crashing', () => {
  shallow(<Results />);
});
