import React from 'react';
import PropTypes from 'prop-types';
import { Error } from '../../components';
import { registerError } from '../../state/error/actions';
import './FatalErrorBoundary.css';

class FatalErrorBoundary extends React.Component {
    state = {
        hasError: false,
    }

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
    }

    componentDidCatch(error, info){
        this.setState({
            hasError: true,
        })
        this.props.dispatch(registerError('FATAL'));
    }

    render() {
        return (
            this.state.hasError ? <Error /> : this.props.children
        )
    }
}

export default FatalErrorBoundary;