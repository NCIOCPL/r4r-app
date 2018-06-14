import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ThemeProvider } from './theme';
import { StaticRouter } from 'react-router-dom';


configure({ adapter: new Adapter() });

// BIG NOTE:
// Currently (June 2018) enzyme has not been updated to correctly handle the new React ^16.3 context API. 
// The dependency enzyme-context-patch adds a postinstall hook that lets Enzyme support the API until the official
// library updates. When it does, future you should be able to remove the patch dependency with no changes to tests. (Fingers crossed).

// This gives us a useful helper function to quickly test components that are 'littered' with Themed components
global.mountWithTheme = node => mount(<ThemeProvider theme={{}}>{ node }</ThemeProvider>);

// Containers containing Link or Route components need to be wrapped in a router. We use StaticRouter for minimal footprint
global.mountWithRouter = node => mount(<StaticRouter>{ node }</StaticRouter>);

global.mountWithThemeAndRouter = node => mount(<StaticRouter><ThemeProvider theme={{}}>{ node }</ThemeProvider></StaticRouter>);
