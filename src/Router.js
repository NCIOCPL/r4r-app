import React from 'react';
import { ConnectedRouter as Router } from 'react-router-redux';
import {
    Switch,
    Route
} from 'react-router-dom';
import Home from './views/home';
import Results from './views/results';
import Resource from './views/resource';
import NavigationHandler from './NavigationHandler';
import ErrorBoundary from './ErrorBoundary';

const AppRouter = ({ history }) => (
    <Router history={ history }>
        <NavigationHandler>
            <ErrorBoundary>
                <Switch>
                    <Route path="/search" component={ Results } />
                    <Route path="/resource/:id" component={ Resource } />
                    <Route path="*" component={ Home } />
                </Switch>
            </ErrorBoundary>
        </NavigationHandler>
    </Router>
)

export default AppRouter;