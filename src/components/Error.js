import React from 'react';
import PropTypes from 'prop-types';
import { Theme } from '../theme';
import './Error.css'

class Error extends React.PureComponent {
    static propTypes = {
        message: PropTypes.string,
    }

    static defaultProps = {
        message: 'Unknown Error: please try refreshing',
    }

    render(){
        return(
            <Theme element="div" className="r4r-error">
                <h1>Error:</h1>
                <h3>{ this.props.message }</h3>
                <p>Please try refreshing the page</p>
            </Theme>
        )
    }
}

export default Error;