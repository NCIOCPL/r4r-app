import React from 'react';
import PropTypes from 'prop-types';
import { Theme } from '../theme';
import './BrowseTile.css';

class BrowseTile extends React.PureComponent {
    static propTypes = {
        className: PropTypes.string,
        onClick: PropTypes.func.isRequired,
        onKeyPress: PropTypes.func.isRequired,
    }

    static defaultProps = {
        onClick: () => {},
        onKeyPress: () => {},
        className: 'browse__tile',
    }

    render() {
        return (
            <Theme
                element="a"
                className={ this.props.className }
                role="link"
                tabIndex='0' 
                onClick={ this.props.onClick }
                onKeyPress={ this.props.onKeyPress }
            >
                { this.props.label }
            </Theme>
        )
    }
}

export default BrowseTile;