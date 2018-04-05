import React from 'react';
import PropTypes from 'prop-types';

class MultiLineText extends React.PureComponent {
    static propTypes = {
        text: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
    }
    
    static defaultProps = {
        type: 'p',
        text: '',
    }

    render(){
        if(!this.props.text) {
            return null;
        }

        return this.props.text.split('\n').map((paragraph, idx) => (
            <this.props.type key={idx}>{ paragraph }</this.props.type>
        ))
    }
}


export default MultiLineText;