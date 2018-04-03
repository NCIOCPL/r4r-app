// TODO: EVERYTHINGGGGGGG (- SOME THINGS)!

// Pass in search callbacks to add as onClick handlers for the various pager elements

import React from 'react';
import PropTypes from 'prop-types';
import '../polyfills/array_fill';
import './Pager.css';

class Pager extends React.PureComponent {
    static propTypes = {
        total: PropTypes.number.isRequired,
        startFrom: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        resultsSize: PropTypes.number.isRequired,
        onClick: PropTypes.func,
    }

    static defaultProps = {
        pageSize: 20,
        startFrom: 45,
        onClick: () => {},
    }

    onClick = (from, isCurrent) => () => {
        if(!isCurrent) {
            this.props.onClick({ from })
        }
    }

    renderPages = (total, current) => {
        const pages = Array(total).fill().map((el, idx) => {
            const isCurrent = current === idx + 1;
            return (
                <div
                    key={ idx } 
                    className={ `pager__num ${ isCurrent ? 'pager__num--active' : ''}`}
                    onClick={ this.onClick((idx * this.props.pageSize), isCurrent) }
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