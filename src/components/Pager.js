// TODO: EVERYTHINGGGGGGG!
// Props: Total results, current page start number, default quantity, custom quantity, current page result quantity

// Calculate: Blocks = total / quantity (this is a problem on the last page, need a set quantity )
// Calculate: Which block current start number is in.

// Pass in search callbacks to add as onClick handlers for the various pager elements

import React from 'react';

class Pager extends React.PureComponent {

    render(){
        const {
            total,
            startFrom,
            pageSize = 20,
            resultsSize,
        } = this.props;
        const isSinglePageOnly = total <= pageSize;
        const isFirstPage = startFrom <= pageSize;
        const isLastPage = startFrom >= total - pageSize;
        const totalPages = Math.ceil(total / pageSize);
        const currentPage = Math.ceil(startFrom / pageSize)
        return (
            !isSinglePageOnly &&
                <div className='r4r-pager'>
                    { 
                        !isFirstPage && 
                            <div>Back</div> 
                    }
                    {
    
                    }
                    { 
                        !isLastPage && 
                            <div>Forward</div> 
                    }
                </div>
        )
    }
}


export default Pager;