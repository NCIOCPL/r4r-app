import React from 'react';
import {
    Router,
    Switch,
    Route
} from 'react-router-dom';
import Home from './views/home';
import Results from './views/results';
import Resource from './views/resource';
import ScrollReset from './ScrollReset';

const AppRouter = ({ history }) => (
    <Router history={ history }>
        <ScrollReset>
            <Switch>
                <Route path="/search" component={ Results } />
                <Route path="/resource/:id" component={ Resource } />
                <Route path="*" component={ Home } />
            </Switch>
        </ScrollReset>
    </Router>
)

export default AppRouter;