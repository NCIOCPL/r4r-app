import React from 'react';
import './ScienceSpinner.css';

const ScienceSpinner = () => (
    <div 
        className="r4r-spinner"
        role="alertdialog" 
        aria-busy="true" 
        aria-live="assertive"
    >
        <div className="nucleobase"></div>
        <div className="nucleobase"></div>
        <div className="nucleobase"></div>
        <div className="nucleobase"></div>
        <div className="nucleobase"></div>
        <div className="nucleobase"></div>
        <div className="nucleobase"></div>
        <div className="nucleobase"></div>
    </div>
)

export default ScienceSpinner;