import React from 'react';
import PropTypes from 'prop-types';
import { Theme } from '../theme';
import './NoResults.css';

const NoResults = ({ viewAll }) => (
    <Theme element="div" className="results__noresults">No results were found for your search. Please try another search or <a onClick={ viewAll }>view all resources.</a></Theme>
)

NoResults.propTypes = {
    viewAll: PropTypes.func.isRequired,
}

NoResults.defaultProps = {
    viewAll: () => {}
}

export default NoResults;