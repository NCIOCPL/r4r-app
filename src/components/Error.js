import React from 'react';
import PropTypes from 'prop-types';
import { Theme } from '../theme';
import { Link } from 'react-router-dom';
import './Error.css'

const Error = ({ title, body, showRedirect }) => (
    <Theme element="div" className="r4r-error">
        <h1>{ title }</h1>
        <p>{ body }</p>
        {
            showRedirect &&
                <p>Please visit the <Link to="/">Resources for Researchers home page</Link> to search or browse resources.</p>
        }
    </Theme>
)

Error.propTypes = {
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    showRedirect: PropTypes.bool.isRequired,
}

Error.defaultProps = {
    title: 'Error',
    body: 'A system error occured or your request timed out. Please try refreshing the page',
    showRedirect: false,
}


export default Error;