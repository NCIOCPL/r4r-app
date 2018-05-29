import React from 'react';
import { ConnectedRouter as Router } from 'react-router-redux';
import {
    Switch,
    Route
} from 'react-router-dom';
import Home from './views/home';
import Results from './views/results';
import Resource from './views/resource';

const AppRouter = ({ history }) => (
    <Router history={ history }>
        <Switch>
            <Route path="/search" component={ Results } />
            <Route path="/resource/:id" component={ Resource } />
            <Route path="*" component={ Home } />
        </Switch>
    </Router>
)

export default AppRouter;