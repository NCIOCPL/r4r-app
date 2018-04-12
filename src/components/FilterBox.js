import React from 'react';
import PropTypes from 'prop-types';
import { Theme } from '../theme';
import CheckFilter from './CheckFilter';
import '../polyfills/object_entries';

class FilterBox extends React.PureComponent {
    static propTypes = {
        className: PropTypes.string,
        facet: PropTypes.shape({
            title: PropTypes.string.isRequired,
            items: PropTypes.objectOf(PropTypes.shape({
                label: PropTypes.string,
                selected: PropTypes.bool.isRequired,
                count: PropTypes.number.isRequired,
            }))
        }),
        onChange: PropTypes.func.isRequired,
    }

    static defaultProps = {
        onChange: () => {},
    }

    render() {
        return this.props.facet 
            ?
                <Theme type="div" className={`facet__box ${ this.props.className ? 'facet__box--' + this.props.className : '' }`}>
                    <Theme type="h4" className={`facet__title ${ this.props.className ? 'facet__title--' + this.props.className : '' }`}>{ this.props.facet.title }</Theme>
                    { 
                        Object.entries(this.props.facet.items).map(([ 
                            key,
                            {
                                label,
                                selected,
                                count
                            }
                        ], idx) => (
                            <CheckFilter 
                                key={ idx }
                                value={ key }
                                label={ label }
                                checked={ selected }
                                count={ count }
                                onChange={ this.props.onChange(key) }
                                className={ 'facet__filter'}
                            />
                        ))
                    }
                </Theme>
            : 
                null
    }
}

export default FilterBox;