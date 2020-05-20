import React from 'react';
import PropTypes from 'prop-types';
import { Theme } from '../../theme';
import { 
    keyHandler,
    formatPagerArray,
} from '../../utilities';
import '../../polyfills/array_fill';
import './Pager.css';

class Pager extends React.PureComponent {
    static propTypes = {
        total: PropTypes.number.isRequired,
        startFrom: PropTypes.number,
        pageSize: PropTypes.number.isRequired,
        resultsSize: PropTypes.number.isRequired,
        onClick: PropTypes.func,
    }

    static defaultProps = {
        pageSize: 20,
        onClick: () => {},
        total: 0,
        resultsSize: 0,
        startFrom: 1,
    }

    onClick = (from, isCurrent) => () => {
        if(!isCurrent) {
            this.props.onClick({ from })
        }
    }

    renderPages = (total, current) => {
        const pages = formatPagerArray(total, current);
        
        const renderedPages = pages.map((el, idx) => {
            const isCurrent = current === el;
            return el
                ?
                    <Theme
                        element="div"
                        key={ idx } 
                        className={ `pager__num ${ isCurrent ? 'pager__num--active' : ''}`}
                        onClick={ this.onClick(((el - 1) * this.props.pageSize), isCurrent) }
                        onKeyPress={ keyHandler({
                            fn: this.onClick(((el - 1) * this.props.pageSize), isCurrent),
                        })}
                        tabIndex="0"
                        role="link"
                        aria-label={`Results Page ${ el }`}
                    >
                    { el }
                    </Theme>
                :
                    <Theme
                        element="div"
                        key={ idx }
                        className={ `pager__num pager__ellipses`}
                    >
                    ...
                    </Theme>
        })
        
        return renderedPages;
    }

    render(){
        const {
            total,
            startFrom,
            pageSize,
            resultsSize,
        } = this.props;

        const isSinglePageOnly = total <= pageSize;
        const isFirstPage = (startFrom + resultsSize) <= pageSize;
        const isLastPage = startFrom >= total - pageSize;
        const totalPages = Math.ceil(total / pageSize);
        const currentPage = Math.ceil((startFrom + 1) / pageSize);
        return (
            <React.Fragment>
                {
                    !isSinglePageOnly &&
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

                }
            </React.Fragment>
        )
    }
}


export default Pager;