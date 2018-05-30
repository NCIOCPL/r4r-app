import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { goBack } from 'react-router-redux';
import { Theme } from '../../theme';
import SearchBar from '../../components/SearchBar';
import BrowseTile from '../../components/BrowseTile';
import ContactInformation from '../../components/ContactInformation';
import Spinner from '../../components/CTS_Spinner';
import { 
    updateSearchBar,
} from '../../state/searchForm/actions';
import { 
    searchRedirect as newSearch,
    fetchResource,
    setFetchingStatus,
} from '../../state/api/actions';
import {
    keyHandler,
    renderDocsString,
} from '../../utilities';
import {
    memoizeFilters,
} from '../../utilities/reselectHelpers';
import {
    resourceInterface
} from '../../interfaces';
import './index.css';
import ResourceAccess from '../../components/ResourceAccess';

export class Resource extends React.Component {
    static propTypes = {
        newSearch: PropTypes.func.isRequired,
        searchBarOnChange: PropTypes.func.isRequired,
        fetchResource: PropTypes.func.isRequired,
        searchBarValue: PropTypes.string,
        resource: resourceInterface,
        currentResults: PropTypes.arrayOf(resourceInterface),
        location: PropTypes.shape({
            search: PropTypes.string.isRequired,
        }),
        history: PropTypes.arrayOf(PropTypes.shape({
            pathname: PropTypes.string,
            search: PropTypes.string,
            hash: PropTypes.string,
            key: PropTypes.string,
        })),
        goBack: PropTypes.func.isRequired,
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
        return this.props.filters.map(({
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

    componentWillUnmount(){
        //TODO: custom unmount action (UI actions)
        this.props.setFetchingStatus(false);
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
                            this.props.history.length > 1 && (this.props.history[this.props.history.length - 2].pathname === '/search') &&
                                <Theme element="a"
                                    className="resource__back" 
                                    onClick={ this.props.goBack }
                                    onKeyPress={ keyHandler({
                                        fn: this.props.goBack,
                                    })}
                                    tabIndex="0"
                                    aria-label="Back to search results link"
                                >
                                    <p>&lt; Back to results</p>
                                </Theme>
                        }
                        <Link to="/" aria-label="Back to home link">Resources for Researchers Home</Link>
                    </Theme>
                    <article aria-label="Resource description" dangerouslySetInnerHTML={{__html: body}} />
                    <Theme element="div" className="resource__link--external">
                        <a href={ website }>Visit Resource</a>
                    </Theme>
                    <ResourceAccess 
                        type={ resourceAccess.type }
                        notes={ resourceAccess.notes }
                    />
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
                            <Theme element="article" className="resource__docs" aria-label="NCI Affiliation Information">
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

const mapStateToProps = ({ api, searchForm, router, history }) => ({
    resource: api.currentResource,
    filters: memoizeFilters(api),
    currentResults: api.currentResults,
    searchBarValue: searchForm.searchBarValues.resource,
    location: router.location,
    history,
})

const mapDispatchToProps = {
    newSearch,
    searchBarOnChange: updateSearchBar,
    fetchResource,
    setFetchingStatus,
    goBack,
}

export default connect(mapStateToProps, mapDispatchToProps)(Resource);