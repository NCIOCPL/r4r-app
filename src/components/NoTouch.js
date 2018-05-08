import React from 'react';
import PropTypes from 'prop-types';
import { Theme } from '../theme';

class NoTouch extends React.PureComponent {
    static propTypes = {

    }

    render(){
        console.log('No-Touch')
        return(
            <Theme
                element="div"
                className="notouch-overlay"
            >
                {this.props.children}
            </Theme>
        )
    }
}

export default NoTouch;