import React from 'react';
import PropTypes from 'prop-types';
import { Theme } from '../theme';
import { Link } from 'react-router-dom';

class ResultTile extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
    }

    static defaultProps = {
        title: '',
        description: '',
    }

    render() {
        return (
            <Theme element="article" className="result-tile" aria-label="search result">
                <h2><Link to={`/resource/${ this.props.id }`}>{ this.props.title }</Link></h2>
                <p dangerouslySetInnerHTML={{ __html: this.props.description }}/>
            </Theme>
        )
    }
}

export default ResultTile;