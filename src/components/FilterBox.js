import React from 'react';
import CheckFilter from './CheckFilter';
import '../polyfills/object_entries';

class FilterBox extends React.PureComponent {
    onChange = value => {
        // TODO: Set filters selected in store, generate new query string, execute new query
        console.log('Dummy filter onChange function firing', {
            param: this.props.facet.param,
            value,
        })
    }

    render() {
        return this.props.facet 
            ?
                <div className={`facet__box ${ this.props.className ? 'facet__box--' + this.props.className : '' }`}>
                    <h4 className={`facet__title ${ this.props.className ? 'facet__title--' + this.props.className : '' }`}>{ this.props.facet.title }</h4>
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
                </div>
            : 
                null
    }
}

export default FilterBox;