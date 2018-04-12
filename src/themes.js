import React from 'react';

const ThemeContext = React.createContext();

export class ThemeProvider extends React.Component {
    render() {
        return (
            <ThemeContext.Provider
                value={ this.props.theme }
            >
                { this.props.children }
            </ThemeContext.Provider>
        )
    }
}

export class Theme extends React.Component {
    render() {
        const {
            type: Type,
            className,
            children,
            ...rest,
        } = this.props;
        return (
            <ThemeContext.Consumer>
                {
                    theme => (
                        <Type 
                            className={ `${ className } ${ theme[className] ? theme[className] : '' }`}
                            { ...rest }
                        >
                            { children }
                        </Type>
                    )
                }
            </ThemeContext.Consumer>
        )
    }
}
