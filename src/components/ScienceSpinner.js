import React from 'react';
import './ScienceSpinner.css';

const ScienceSpinner = () => (
    <div 
        className="DNA_cont"
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
        <div className="nucleobase"></div>
        <div className="nucleobase"></div>
    </div>
)

export default ScienceSpinner;