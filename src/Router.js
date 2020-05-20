import React from "react";
import { ConnectedRouter as Router } from "react-router-redux";
import { Switch, Route } from "react-router-dom";
import Home from "./views/home.js";
import Results from "./views/results.js";
import Resource from "./views/resource.js";
import { PageNotFound, ErrorBoundary } from "./components";

const AppRouter = ({ history }) => (
  <Router history={history}>
    <ErrorBoundary>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/search' component={Results} />
        <Route path='/resource/:id' component={Resource} />
        <Route path='*' component={PageNotFound} />
      </Switch>
    </ErrorBoundary>
  </Router>
);

export default AppRouter;
