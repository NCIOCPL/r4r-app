import React from 'react';
import PropTypes from 'prop-types';
import FilterBox from './FilterBox';
import { Theme } from '../theme';


class Filters extends React.PureComponent {
    static propTypes = {
        facets: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
    }

    render(){
        const toolTypesTypeFilters = this.props.facets['toolTypes.type'].items || [];
        const isToolTypeSelected = Object.entries(toolTypesTypeFilters).some(([key, obj]) => obj.selected);
        return (
            <Theme element="section" className="results__facets" aria-label="Search Filters">
                <FilterBox 
                    className="tool-types"
                    facet={ this.props.facets['toolTypes.type'] }
                    onChange={ this.props.onChange('toolTypes.type') }
                />
                <FilterBox
                    className="subtool-types"
                    facet={ this.props.facets['toolTypes.subtype'] }
                    onChange={ this.props.onChange('toolTypes.subtype') }
                    isVisible={ isToolTypeSelected }
                />                        
                <FilterBox 
                    facet={ this.props.facets['researchAreas'] }
                    onChange={ this.props.onChange('researchAreas') }
                />
                <FilterBox 
                    facet={ this.props.facets['researchTypes'] }
                    onChange={ this.props.onChange('researchTypes') }
                />
            </Theme>
        )
    }
}

export default Filters;