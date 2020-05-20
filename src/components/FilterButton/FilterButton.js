import React from 'react';
import PropTypes from 'prop-types';
import { Theme } from '../../theme';

const FilterButton = ({ isMobileMenuOpen, toggleMobileMenu, filtersCount }) => (
    <Theme
        element="button"
        className="results__filter-button"
        onClick={ toggleMobileMenu }
    >
        { 
            !isMobileMenuOpen 
                ? 
                    `Filter${ filtersCount ? ` (${ filtersCount })` : '' }` 
                : 
                    'Done' 
        }
    </Theme>
)

FilterButton.propTypes = {
    isMobileMenuOpen: PropTypes.bool,
    toggleMobileMenu: PropTypes.func,
    filtersCount: PropTypes.number,
}

FilterButton.defaultProps = {
    isMobileMenuOpen: false,
    toggleMobileMenu: () => {},
    filtersCount: 0,
}

export default FilterButton;