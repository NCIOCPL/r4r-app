import React from 'react';
import { ConnectedRouter as Router } from 'react-router-redux';
import {
    Switch,
    Route
} from 'react-router-dom';
import Home from './views/home';
import Results from './views/results';
import Resource from './views/resource';
import PageNotFound from './components/PageNotFound';
import ErrorBoundary from './ErrorBoundary';

const AppRouter = ({ history }) => (
    <Router history={ history }>
        <ErrorBoundary>
            <Switch>
                <Route exact path="/" component={ Home } />
                <Route path="/search" component={ Results } />
                <Route path="/resource/:id" component={ Resource } />
                <Route path="*" component={ PageNotFound } />
            </Switch>
        </ErrorBoundary>
    </Router>
)

export default AppRouter;