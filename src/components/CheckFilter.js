import React from 'react';
import PropTypes from 'prop-types';
import { Theme } from '../theme';
import { keyHandler } from '../utilities';

class CheckFilter extends React.PureComponent {
    static propTypes = {
        label: PropTypes.string.isRequired,
        checked: PropTypes.bool.isRequired,
        count: PropTypes.number.isRequired,
        className: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
    }

    static defaultProps = {
        className: 'filter-box__filter',
        onChange: () => {},
        checked: false,
        label: '',
        count: ''
    }

    onChange = () => {
        this.props.onChange(this.props.value);
    }

    render() {
        return (
            <Theme
                element="label"
                className={ this.props.className }
                role="checkbox"
                tabIndex="0"
                onKeyPress={ keyHandler({
                    fn: this.onChange,
                })}
            >
                <Theme
                    element="input" 
                    type="checkbox"
                    value={ this.props.label }
                    checked={ this.props.checked }
                    onChange={ this.onChange }
                    className='filter__checkbox'
                    tabIndex="-1"
                />
                <Theme element="span" className='filter__label'>
                    {`${this.props.label} (${this.props.count})`}
                </Theme>
            </Theme>
        )
    }
}

export default CheckFilter;