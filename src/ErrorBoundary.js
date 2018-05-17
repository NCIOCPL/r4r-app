import React from 'react';
import PropTypes from 'prop-types';
import Error from './components/Error';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

export class ErrorBoundary extends React.Component {
    static propTypes = {
        error: PropTypes.string,
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ])
    }
    
    render(){
        if(this.props.error){
            return <Error message={ this.props.error }/>
        }
        return this.props.children;
    }
}

const mapStateToProps = store => ({
    error: store.error,
})

export default withRouter(connect(mapStateToProps)(ErrorBoundary));