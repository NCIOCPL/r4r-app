import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
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
            this.state.hasError
                ?
                    <div className="r4r-boundary">
                        <div className="boundary__inner">
                            <p>An unexpected error has occured.</p>
                            <p>Please try refreshing the page.</p>
                        </div>
                    </div>
                :
                    this.props.children
        )
    }
}

export default ErrorBoundary;