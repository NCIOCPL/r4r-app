import React from 'react';
import PropTypes from 'prop-types';
import Error from './components/Error';
import { connect } from 'react-redux';

export class ErrorBoundary extends React.Component {
    static propTypes = {
        error: PropTypes.string,
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ]),
        location: PropTypes.shape({
            search: PropTypes.string.isRequired,
        })
    }
    
    render(){
        if(this.props.error){
            return <Error message={ this.props.error }/>
        }
        return this.props.children;
    }
}

const mapStateToProps = ({ error, router }) => ({
    error,
    location: router.location,
})

export default connect(mapStateToProps)(ErrorBoundary);