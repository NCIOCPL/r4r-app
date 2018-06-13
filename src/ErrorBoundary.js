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
    //TODO: Conditionally rendering different types of errors using this same component
    render(){
        if(this.props.error){
            return <Error message={ this.props.error } showRedirect={ true } />
        }
        return this.props.children;
    }
}

const mapStateToProps = ({ error, router }) => ({
    error,
    location: router.location,
})

export default connect(mapStateToProps)(ErrorBoundary);