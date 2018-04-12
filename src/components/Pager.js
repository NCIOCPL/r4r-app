// TODO: EVERYTHINGGGGGGG (- SOME THINGS)!

// Pass in search callbacks to add as onClick handlers for the various pager elements

import React from 'react';
import PropTypes from 'prop-types';
import { Theme } from '../theme';
import PagerCounter from './PagerCounter';
import { keyHandler } from '../utilities';
import '../polyfills/array_fill';
import './Pager.css';

class Pager extends React.PureComponent {
    static propTypes = {
        total: PropTypes.number.isRequired,
        startFrom: PropTypes.number,
        pageSize: PropTypes.number.isRequired,
        resultsSize: PropTypes.number.isRequired,
        onClick: PropTypes.func,
        withCounter: PropTypes.bool,
    }

    static defaultProps = {
        pageSize: 20,
        onClick: () => {},
        withCounter: false,
        total: 0,
        resultsSize: 0,
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
                <Theme
                    element="div"
                    key={ idx } 
                    className={ `pager__num ${ isCurrent ? 'pager__num--active' : ''}`}
                    onClick={ this.onClick((idx * this.props.pageSize), isCurrent) }
                    onKeyPress={ keyHandler({
                        fn: this.onClick((idx * this.props.pageSize), isCurrent),
                    })}
                    tabIndex="0"
                    role="link"
                    aria-label={`Results Page ${ idx + 1 }`}
                >
                { idx + 1 }
                </Theme>
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

        if(!total || !resultsSize) {
            return null;
        }

        const isSinglePageOnly = total <= pageSize;
        const isFirstPage = (startFrom + resultsSize) <= pageSize;
        const isLastPage = startFrom >= total - pageSize;
        const totalPages = Math.ceil(total / pageSize);
        const currentPage = Math.ceil((startFrom + 1) / pageSize);
        return (
            !isSinglePageOnly &&
            <Theme element="nav" className="r4r-pager">
                {
                    /* Allow an optional results counter */
                    this.props.withCounter &&
                        <PagerCounter
                            from={ startFrom }
                            to={ startFrom + resultsSize }
                            total={ total }
                        />
                }
                <Theme element="div" className='r4r-pager__nav'>
                    { 
                        !isFirstPage && 
                            <Theme
                                element="div"
                                className='pager__arrow' 
                                tabIndex="0"
                                onClick={ this.onClick((startFrom - pageSize), false) }
                                onKeyPress={ keyHandler({
                                    fn: this.onClick((startFrom - pageSize), false),
                                })}
                                aria-label="previous results page"
                                role="link"
                            >
                            { '<' }
                            </Theme> 
                    }
                    {
                        this.renderPages(totalPages, currentPage)
                    }
                    { 
                        !isLastPage && 
                            <Theme
                                element="div" 
                                className='pager__arrow' 
                                tabIndex="0"
                                onClick={ this.onClick((startFrom + pageSize), false) }
                                onKeyPress={ keyHandler({
                                    fn: this.onClick((startFrom + pageSize), false),
                                })}
                                aria-label="next results page"
                                role="link"
                            >
                            { '>' }
                            </Theme> 
                    }
                </Theme>
            </Theme>
        )
    }
}


export default Pager;