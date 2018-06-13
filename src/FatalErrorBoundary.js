import React from 'react';
import Error from './components/Error';
import './FatalErrorBoundary.css';

class FatalErrorBoundary extends React.Component {
    state = {
        hasError: false,
    }

    componentDidCatch(error, info){
        this.setState({
            hasError: true,
        })
    }

    render() {
        return (
            this.state.hasError ? <Error /> : this.props.children
        )
    }
}

export default FatalErrorBoundary;