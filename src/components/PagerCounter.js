import React from 'react';
import PropTypes from 'prop-types';
import { Theme } from '../theme';

class PagerCounter extends React.PureComponent {
    static propTypes = {
        from: PropTypes.number.isRequired,
        to: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
    }

    render() {
        if(!this.props.from || !this.props.to || !this.props.total) {
            return null;
        }
        return (
            <Theme type="div" className="r4r-pager__count" aria-label="Results count">
                <p>{`${ this.props.from } - ${ this.props.to } of ${ this.props.total }`}</p>
            </Theme>
        )
    }
}

export default PagerCounter;