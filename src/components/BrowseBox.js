import React from 'react';
import PropTypes from 'prop-types';
import BrowseTile from './BrowseTile';
import './BrowseBox.css';

class BrowseBox extends React.PureComponent {
    static propTypes = {
        facetFilters: PropTypes.array.isRequired,
        className: PropTypes.string,
        searchFunction: PropTypes.func.isRequired,
        filterType: PropTypes.string.isRequired,
    }

    static defaultProps = {
        facetFilters: [],
    }

    render() {
        return(
            <div className={`browse-tiles__container ${this.props.className ? `browse-tiles__container--${ this.props.className }` : '' }`}>
                {
                    this.props.facetFilters.map((filter, idx) => {
                        return (
                            <BrowseTile
                                key={ idx }
                                label={ filter.label }
                                onClick={ 
                                    this.props.searchFunction({
                                        filterType: this.props.filterType,
                                        filter: filter.key
                                    })
                                }
                            />
                        )
                    })
                }
            </div>
        )
    }
}

export default BrowseBox;