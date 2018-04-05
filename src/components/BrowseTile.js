import React from 'react';
import PropTypes from 'prop-types';
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
    }

    render() {
        return (
            <div 
                className={ `browse__tile ${ this.props.className ? this.props.className : '' }` } 
                tabIndex='0' 
                onClick={ this.props.onClick }
                onKeyPress={ this.props.onKeyPress }
            >
                <p>{ this.props.label }</p>
            </div>
        )
    }
}

export default BrowseTile;