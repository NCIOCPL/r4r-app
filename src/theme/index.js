import React from 'react';
import { defaultThemeHooks } from './defaultTheme';

const ThemeContext = React.createContext();

export const createTheme = customTheme => {
    const theme = defaultThemeHooks.reduce((acc, hook) => {
        acc[hook] = customTheme[hook] || 'r4r-DEFAULT'
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
            element: Element = 'div',
            className = '',
            children,
            ...rest
        } = this.props;
        const classNames = className.split(' ');
        const [ primaryClassName, ...otherClassNames ] = classNames;
        const secondaryClassNames = otherClassNames.join(' ');
        return (
            <ThemeContext.Consumer>
                {
                    theme => (
                        <Element 
                            className={ `${ primaryClassName } ${ secondaryClassNames } ${ theme[primaryClassName] ? theme[primaryClassName] : '' }`}
                            { ...rest }
                        >
                            { children }
                        </Element>
                    )
                }
            </ThemeContext.Consumer>
        )
    }
}
