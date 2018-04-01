import React from 'react';
import {
    Router,
    Switch,
    Route
} from 'react-router-dom';
import history from './history';
import Home from './views/home';
import Results from './views/results';
import Resource from './views/resource';

const AppRouter = () => (
    <Router history={ history }>
        <Switch>
            <Route path="/search" component={ Results } />
            <Route path="/resource/:id" component={ Resource } />
            <Route path="*" component={ Home } />
        </Switch>
    </Router>
)

export default AppRouter;