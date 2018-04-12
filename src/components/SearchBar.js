import React from 'react';
import PropTypes from 'prop-types';
import { Theme } from '../theme';
import './SearchBar.css';

class SearchBar extends React.PureComponent {
    static propTypes = {
        page: PropTypes.oneOf(['home', 'resource', 'results']),
        value: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
    }

    static defaultProps = {
        onChange: () => {},
        onSubmit: () => {},
    }

    onChange = e => {
        e.preventDefault();
        this.props.onChange({
            page: this.props.page,
            value: e.target.value,
        })
    }

    onSubmit = e => {
        e.preventDefault();
        this.props.onSubmit();
    }

    render() {
        return(
            <Theme element="form" onSubmit={ this.onSubmit } className='searchbar__container'>
                <input 
                    type="text" 
                    value={ this.props.value }
                    onChange={ this.onChange }
                    aria-label="search"
                />
                <Theme
                    element="input" 
                    type="submit" 
                    value="Search"
                    className="searchbar__button--submit"
                />
            </Theme>
        )
    }
}

export default SearchBar;