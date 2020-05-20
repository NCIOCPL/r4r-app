import React from 'react';
import { Theme } from '../../theme';

const NoTouch = props => (
    <Theme
        element="div"
        className="notouch-overlay"
    >
        { props.children }
    </Theme>
)

export default NoTouch;