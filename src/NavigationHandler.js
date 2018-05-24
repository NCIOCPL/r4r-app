import React from 'react';
import { connect } from 'react-redux';
import { clearError } from './state/error/actions';
import { setFetchingStatus } from './state/api/actions';

class NavigationHandler extends React.Component{
    componentDidUpdate(prevProps){
        if(this.props.location !== prevProps.location){
            window.scrollTo(0,0);
            if(this.props.error){
                this.props.clearError();
            }
        }
    }

    render(){
        return this.props.children;
    }
}
const mapStateToProps = ({ error, router }) => ({
    error,
    location: router.location,
})

const mapDispatchToProps = {
    clearError,
    setFetchingStatus,
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationHandler);