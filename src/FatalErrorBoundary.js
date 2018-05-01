import React from 'react';
import { Theme } from './theme';
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
            this.state.hasError
                ?
                    <Theme element="div" className="r4r-boundary">
                        <Theme element="div" className="boundary__inner">
                            <p>An unexpected error has occured.</p>
                            <p>Please try refreshing the page.</p>
                        </Theme>
                    </Theme>
                :
                    this.props.children
        )
    }
}

export default FatalErrorBoundary;