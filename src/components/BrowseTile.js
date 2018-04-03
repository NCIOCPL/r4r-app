import React from 'react';
import './BrowseTile.css';

class BrowseTile extends React.PureComponent {

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