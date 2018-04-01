import React from 'react';
import './SearchSpinner.css';

const SearchSpinner = () => (
    <div className="spinner__container">
        <div className="spinner slabs">
            <div className="slab"></div>
            <div className="slab"></div>
            <div className="slab"></div>
            <div className="slab"></div>
        </div>
    </div>
)

export default SearchSpinner;