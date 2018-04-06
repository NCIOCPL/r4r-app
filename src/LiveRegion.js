import React from 'react';
import { connect } from 'react-redux';

// Use this component to announe state changes to screen-readers
// by passing a message to state/announcements/actions/newMessage()
class LiveRegion extends React.PureComponent {
    render() {
        return (
            <div 
                className="r4r-hidden"
                role="alertdialog"
                aria-live="polite" 
                aria-atomic="true" 
                tabIndex="-1"
            >
                {this.props.message}
            </div>
        )
    }
}

const mapStateToProps = ({ announcements }) => ({
    message: announcements.liveMessage,
})

export default connect(mapStateToProps)(LiveRegion);