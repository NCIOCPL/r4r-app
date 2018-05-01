import React from 'react';
import PropTypes from 'prop-types';

class Error extends React.PureComponent {
    static propTypes = {
        message: PropTypes.string,
    }

    static defaultProps = {
        message: 'Unknown Error: please try refreshing',
    }

    render(){
        return(
            <div>
                <h1>Error</h1>
                <p>{ this.props.message }</p>
            </div>
        )
    }
}

export default Error;