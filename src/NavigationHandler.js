import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { clearError } from './state/error/actions';

class NavigationHandler extends React.Component{
    componentDidUpdate(prevProps){
        if(this.props.location !== prevProps.location){
            window.scrollTo(0,0);
            this.props.clearError();
        }
    }

    render(){
        return this.props.children;
    }
}

const mapDispatchToProps = {
    clearError,
}

export default withRouter(connect(null, mapDispatchToProps)(NavigationHandler));