import React from 'react';
import { connect } from 'react-redux';
import { Theme } from './theme';

// Use this component to announe state changes to screen-readers
// by passing a message to state/announcements/actions/newMessage()
export class LiveRegion extends React.PureComponent {
    render() {
        return (
            <Theme
                element="div"
                className="r4r-hidden"
                role="status"
                aria-live="polite" 
                aria-atomic="true" 
                tabIndex="-1"
            >
                {this.props.message}
            </Theme>
        )
    }
}

const mapStateToProps = ({ announcements }) => ({
    message: announcements.liveMessage,
})

export default connect(mapStateToProps)(LiveRegion);