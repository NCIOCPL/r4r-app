import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { clearError } from './state/error/actions';
import { setFetchingStatus } from './state/api/actions';

class NavigationHandler extends React.Component{
    componentDidUpdate(prevProps){
        if(this.props.location !== prevProps.location){
            window.scrollTo(0,0);
            this.props.clearError();
            this.props.setFetchingStatus(false);
        }
    }

    render(){
        return this.props.children;
    }
}

const mapDispatchToProps = {
    clearError,
    setFetchingStatus,
}

export default withRouter(connect(null, mapDispatchToProps)(NavigationHandler));