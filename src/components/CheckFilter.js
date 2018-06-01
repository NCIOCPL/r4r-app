import React from 'react';
import PropTypes from 'prop-types';
import { Theme } from '../theme';
import { keyHandler } from '../utilities';
import SVG from '../components/SVG';
import './CheckFilter.css';

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
                tabIndex="0"
                role="checkbox"
                aria-checked={ this.props.checked }
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
                    <div className="checkbox__outline">
                        {
                            this.props.checked &&
                                <SVG iconType="checkmark" className="checkbox__checkmark"/>
                        }
                    </div>
                    {`${this.props.label} (${this.props.count})`}
                </Theme>
            </Theme>
        )
    }
}

export default CheckFilter;