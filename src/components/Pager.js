// TODO: EVERYTHINGGGGGGG (- SOME THINGS)!

// Pass in search callbacks to add as onClick handlers for the various pager elements

import React from 'react';
import PropTypes from 'prop-types';
import './Pager.css';

class Pager extends React.PureComponent {
    static propTypes = {
        total: PropTypes.number.isRequired,
        startFrom: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        resultsSize: PropTypes.number.isRequired,
    }

    static defaultProps = {
        pageSize: 20,
        startFrom: 45,
    }

    renderPages = (total, current) => {
        const pages = Array(total).fill().map((el, idx) => {
            return (
                <div
                    key={ idx } 
                    className={ `pager__num ${current === idx + 1 ? 'pager__num--active' : ''}`}
                >
                { idx + 1 }
                </div>
            ) 
        })
        return pages;
    }

    render(){
        const {
            total,
            startFrom,
            pageSize,
            resultsSize,
        } = this.props;
        const isSinglePageOnly = total <= pageSize;
        const isFirstPage = startFrom <= pageSize;
        const isLastPage = startFrom >= total - pageSize;
        const totalPages = Math.ceil(total / pageSize);
        const currentPage = Math.ceil((startFrom + 1) / pageSize);
        return (
            !isSinglePageOnly &&
                <div className='r4r-pager'>
                    { 
                        !isFirstPage && 
                            <div className='pager__arrow'>{ '<' }</div> 
                    }
                    {
                        this.renderPages(totalPages, currentPage)
                    }
                    { 
                        !isLastPage && 
                            <div className='pager__arrow'>{ '>' }</div> 
                    }
                </div>
        )
    }
}


export default Pager;