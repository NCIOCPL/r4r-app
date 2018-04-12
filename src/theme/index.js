import React from 'react';
import { defaultThemeHooks } from './defaultTheme';

const ThemeContext = React.createContext();

export const createTheme = customTheme => {
    const theme = defaultThemeHooks.reduce((acc, hook) => {
        acc[hook] = customTheme[hook] || 'r4r__DEFAULT'
        return acc;
    }, {})

    return theme;
}

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
            className = '',
            children,
            ...rest,
        } = this.props;
        const classNames = className.split(' ');
        const [ primaryClassName, ...otherClassNames ] = classNames;
        const secondaryClassNames = otherClassNames.join(' ');
        return (
            <ThemeContext.Consumer>
                {
                    theme => (
                        <Type 
                            className={ `${ primaryClassName } ${ secondaryClassNames } ${ theme[primaryClassName] ? theme[primaryClassName] : '' }`}
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
