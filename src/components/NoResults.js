import React from 'react';
import { Theme } from '../theme';
import './NoResults.css';

class NoResults extends React.PureComponent {
    render(){
        return(
            <Theme element="div" className="results__noresults">No results were found for your search. Please try another search or <a onClick={ this.props.viewAll }>view all resources.</a></Theme>
        )
    }
}

export default NoResults;