import React from 'react';
import PropTypes from 'prop-types';
import { Error } from '../../components';
import { connect } from 'react-redux';
import { 
    ERROR_RESOURCE404
} from '../../utilities/fetchHelpers';

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
        if(this.props.error && this.props.error === ERROR_RESOURCE404){
            return <Error title="Resource Not Found" body="We can't find the resource you're looking for." showRedirect={ true } />
        }
        else if(this.props.error && this.props.error === 'ERROR_PAGE404'){
            return <Error title="Page not found" body="We can't find the page you're looking for." showRedirect={true} />
        }
        else if(this.props.error){
            return <Error showRedirect={ true } />
        }
        else {
            return this.props.children;
        }
    }
}

const mapStateToProps = ({ error, router }) => ({
    error,
    location: router.location,
})

export default connect(mapStateToProps)(ErrorBoundary);