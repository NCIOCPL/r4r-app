import React from 'react';
import { ConnectedRouter as Router } from 'react-router-redux';
import {
    Switch,
    Route
} from 'react-router-dom';
import Home from './views/home';
import Results from './views/results';
import Resource from './views/resource';
import Error from './components/Error';

const AppRouter = ({ history }) => (
    <Router history={ history }>
        <Switch>
            <Route exact path="/" component={ Home } />
            <Route path="/search" component={ Results } />
            <Route path="/resource/:id" component={ Resource } />
            <Route path="*" render={() => <Error title="Page not found" body="We can't find the page you're looking for." showRedirect={true} />} />
        </Switch>
    </Router>
)

export default AppRouter;