import React from 'react';
import PropTypes from 'prop-types';

class MultiLineText extends React.PureComponent {
    render(){
        return this.props.text.split('\n').map((paragraph, idx) => (
            <this.props.type key={idx}>{ paragraph }</this.props.type>
        ))
    }
}

MultiLineText.propTypes = {
    text: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
}

MultiLineText.defaultProps = {
    type: 'p'
}

export default MultiLineText;