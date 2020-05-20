import React from 'react';
import PropTypes from 'prop-types';
import { Theme } from '../../theme';

class PagerCounter extends React.PureComponent {
    static propTypes = {
        from: PropTypes.number,
        to: PropTypes.number,
        total: PropTypes.number,
    }

    render() {

        return (
            !!this.props.from && !!this.props.to && !!this.props.total &&
                <Theme element="div" className="r4r-pager__count" aria-label="Results count">
                    <p>{`${ this.props.from } - ${ this.props.to } of ${ this.props.total }`} results</p>
                </Theme>
        )
    }
}

export default PagerCounter;