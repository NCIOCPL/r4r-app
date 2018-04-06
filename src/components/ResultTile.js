import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class ResultTile extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
    }

    static defaultProps = {
        title: '',
        description: '',
        id: '',
    }

    render() {
        return (
            <article className="result-tile" aria-label="search result">
                <h2>{ this.props.title }</h2>
                {/* TODO: Improve snippet handling */}
                <p>{ this.props.description && `${this.props.description.slice(0, 400)}...`}</p>
                <Link to={`/resource/${ this.props.id }`}>View Resource ></Link>
            </article>
        )
    }
}

export default ResultTile;