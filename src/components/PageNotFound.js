import React from 'react';
import PropTypes from 'prop-types';
import Error from './Error'
import { connect } from 'react-redux';
import { pageNotFound } from '../state/error/actions';

export class PageNotFound extends React.Component {
    static propTypes = {
        pageNotFound: PropTypes.func.isRequired
    }
    
    componentDidMount(){
        this.props.pageNotFound()
    }

    render(){
        return(
            <Error title="Page not found" body="We can't find the page you're looking for." showRedirect={true} />
        )
    }
}

export default connect(null, { pageNotFound })(PageNotFound);