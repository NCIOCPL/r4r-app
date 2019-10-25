import React from 'react';
import PropTypes from 'prop-types';
import { Theme } from '../theme';
import './NoResults.css';


const NoResults = ({ viewAll }) => {

    const handleViewAll = (evt) => {
        evt.preventDefault();
        viewAll(evt);
    }

    return (
        <Theme element="div" className="results__noresults">No results were found for your search. Please try another search or <a href="#viewAll" onClick={ handleViewAll }>view all resources.</a></Theme>
    )
}

NoResults.propTypes = {
    viewAll: PropTypes.func.isRequired,
}

NoResults.defaultProps = {
    viewAll: () => {}
}

export default NoResults;