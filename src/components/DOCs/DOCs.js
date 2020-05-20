import React from 'react';
import PropTypes from 'prop-types';
import { doCsInterface } from '../../interfaces';
import { Theme } from '../../theme';
import { renderDocsString } from '../../utilities';

const DOCs = ({doCs}) => {
    if(!doCs.length) {
        return null;
    }
    return (
        <Theme element="article" className="resource__docs" aria-label="NCI Affiliation Information">
            <h2>NCI Affiliation</h2>
            { renderDocsString(doCs) }
        </Theme>
    );
}

DOCs.propTypes = {
    doCs: PropTypes.arrayOf(doCsInterface),
}

DOCs.defaultProps = {
    doCs: [],
}

export default DOCs;