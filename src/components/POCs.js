import React from 'react';
import PropTypes from 'prop-types';
import ContactInformation from './ContactInformation';
import { poCsInterface } from '../interfaces';

const POCs = ({ poCs }) => {
    if(!poCs.length) {
        return null;
    }
    return (
        <article>
            <h2>Contact Information</h2>
            { 
                poCs.map((poc, idx) => (
                    <ContactInformation contact={ poc } key={ idx } />
                ))
            }
        </article>
    )
}

POCs.propTypes = {
    poCs: PropTypes.arrayOf(poCsInterface)
}

POCs.defaultProps = {
    poCs: [],
}

export default POCs;