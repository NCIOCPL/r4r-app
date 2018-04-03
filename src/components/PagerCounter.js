import React from 'react';
import PropTypes from 'prop-types';

class PagerCounter extends React.PureComponent {
    static propTypes = {
        from: PropTypes.number.isRequired,
        to: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
    }

    render() {
        return (
            <div className="r4r-pager__count">
                <p>{`${ this.props.from } - ${ this.props.to } of ${ this.props.total }`}</p>
            </div>
        )
    }
}

export default PagerCounter;