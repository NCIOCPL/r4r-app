import React from 'react';
import PropTypes from 'prop-types';
import BrowseTile from './BrowseTile';
import './BrowseBox.css';

class BrowseBox extends React.PureComponent {
    static propTypes = {
        facetFilters: PropTypes.object.isRequired,
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
                    Object.entries(this.props.facetFilters).map(([key, { label }], idx) => {
                        return (
                            <BrowseTile
                                key={ idx }
                                label={ label }
                                onClick={ 
                                    this.props.searchFunction({
                                        filterType: this.props.filterType,
                                        filter: key
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