import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Theme } from '../../theme';
import SVG from '../../components/SVG';
import SearchBar from '../../components/SearchBar';
import BrowseTile from '../../components/BrowseTile';
import ContactInformation from '../../components/ContactInformation';
import Spinner from '../../components/CTS_Spinner';
import { 
    updateSearchBar,
} from '../../state/searchForm/actions';
import { 
    newSearch,
    fetchResource,
} from '../../state/api/actions';
import {
    formatFilters,
    keyHandler,
    renderDocsString,
} from '../../utilities';
import {
    resourceInterface
} from '../../interfaces';
import './index.css';

// The API returns resources with one of three types of resourceAccess.type keys. This 
// let's us create the corresponding title client-side.
const resourceAccessTitles = {
    'open': 'Free to use',
    'register': 'This resource requires registration',
    'cost': 'Payment Required'
}

export class Resource extends React.Component {
    static propTypes = {
        newSearch: PropTypes.func.isRequired,
        searchBarOnChange: PropTypes.func.isRequired,
        fetchResource: PropTypes.func.isRequired,
        searchBarValue: PropTypes.string,
        resource: resourceInterface,
        currentResults: PropTypes.arrayOf(resourceInterface),
    }

    newTextSearch = () => {
        // Don't execute on empty search bar
        if(this.props.searchBarValue) {
            this.props.newSearch({
                q: this.props.searchBarValue,
                from: 0,
            });
        }
    }

    newFilterSearch = ({filterType, filter}) => () => {
        this.props.newSearch({ 
            [filterType]: filter,
            from: 0,
        });
    }

    renderSimilarResources = () => {
        const filters = formatFilters(this.props.resource);

        return filters.map(({
            filter,
            filterType,
            label,
        }, idx) => {
            return (
                <BrowseTile
                    key={ idx }
                    label={ label }
                    tabIndex="0"
                    className={ 'similar-resource__tile' }
                    onClick={ this.newFilterSearch({ filterType, filter })}
                    onKeyPress={ keyHandler({
                        fn: this.newFilterSearch({ filterType, filter }),
                    })}
                />
            )
        })
    }

    componentDidMount() {
        const resourceId = this.props.match.params.id;
        this.props.fetchResource(resourceId);
    }

    renderResource = ({
        id,
        title,
        website,
        description,
        body,
        poCs,
        resourceAccess,
        doCs,
    }) => {
        return (
            <Theme element="div" className='r4r-resource'>
                <Helmet>
                    <title>Resources for Researchers: { title } - National Cancer Institute</title>
                    <meta property="og:description" content={ description.substr(0, 300) } />
                    <meta name="description" content={ description.substr(0, 300) } />
                    <meta property="twitter:title" content={`Resources for Researchers: ${ title } - National Cancer Institute`} />
                    <meta property="og:url" content={`https://www.cancer.gov/research/r4r/resource/${ id }`} />
                </Helmet>
                <Theme element="header" className='r4r-resource__header'>
                    <h1>{ title }</h1>
                </Theme>
                <Theme element="div" className="resource__main">
                    <Theme element="div" className="resource__home">
                        {
                            this.props.currentResults && (this.props.currentResults.indexOf(this.props.resource) !== -1) &&
                                <Theme element="a"
                                    className="resource__back" 
                                    onClick={ this.props.history.goBack }
                                    onKeyPress={ keyHandler({
                                        fn: this.props.history.goBack,
                                    })}
                                    tabIndex="0"
                                >
                                    <p>&lt; Back to results</p>
                                </Theme>
                        }
                        <Link to="/">Resources for Researchers Home</Link>
                    </Theme>
                    <article aria-label="Resource Access Information">
                        <Theme element="div" className='resource__access'>
                            <SVG iconType={ resourceAccess.type }/>
                            <h4>{ resourceAccessTitles[resourceAccess.type] }</h4>
                            <p>{ resourceAccess.notes }</p>
                        </Theme>
                    </article>
                    <article aria-label="Resource description" dangerouslySetInnerHTML={{__html: body}} />
                    <Theme element="div" className="resource__link--external">
                        <a href={ website }>Visit Resource</a>
                    </Theme>
                    {
                        (poCs.length > 0) &&
                            <article>
                                    <h2>Contact Information</h2>
                                { 
                                    poCs.map((poc, idx) => (
                                        <ContactInformation contact={ poc } key={ idx } />
                                    ))
                                }
                            </article>
                    }
                    {
                        (doCs.length > 0) &&
                            <Theme element="article" className="resource__docs" aria-label="DOCs information">
                                <h2>NCI Affiliation</h2>
                                { renderDocsString(doCs) }
                            </Theme>
                    }
                </Theme>
                <Theme element="div" className="resource__nav">
                    <section role="search">
                        <SearchBar 
                            value={ this.props.searchBarValue }
                            onChange={ this.props.searchBarOnChange }
                            onSubmit={ this.newTextSearch }
                            placeholder="Find NCI-supported resources"
                            page='resource'
                        />
                    </section>
                    <nav>
                        <h2>Find Related Resources</h2>
                        <Theme element="div" className='similar-resource__container'>
                            { this.renderSimilarResources() }
                        </Theme>
                    </nav>
                </Theme>
            </Theme>
        )
    }

    render() {
        // eslint-disable-next-line
        if(this.props.resource && this.props.match.params.id == this.props.resource.id) {
            return this.renderResource(this.props.resource);
        }
        return <Spinner />;
    }
}

const mapStateToProps = ({ api, searchForm }) => ({
    resource: api.currentResource,
    currentResults: api.currentResults,
    searchBarValue: searchForm.searchBarValues.resource,
})

const mapDispatchToProps = {
    newSearch,
    searchBarOnChange: updateSearchBar,
    fetchResource,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Resource));