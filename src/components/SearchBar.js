import React from 'react';
import './SearchBar.css';

class SearchBar extends React.PureComponent {
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
            <form onSubmit={ this.onSubmit } className='searchbar__container'>
                <input 
                    type="text" 
                    value={ this.props.value }
                    onChange={ this.onChange }
                />
                <input 
                    type="submit" 
                    value="Search"
                />
            </form>
        )
    }
}

export default SearchBar;