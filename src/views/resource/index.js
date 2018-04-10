import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import SearchBar from '../../components/SearchBar';
import BrowseTile from '../../components/BrowseTile';
import MultiLineText from '../../components/MultiLineText';
import ContactInformation from '../../components/ContactInformation';
import Spinner from '../../components/ScienceSpinner';
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

class Resource extends React.PureComponent {
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
            });
        }
    }

    newFilterSearch = ({filterType, filter}) => () => {
        this.props.newSearch({ [filterType]: filter });
    }

    renderSimilarResources = () => {
        // There are a few fidgety bits here. 
        //The name values are the search params themselves.
        //TODO: ANOTHER BIG ISSUE ALL OVER THE APP IS THE FACT THAT THERE CAN BE MULTIPLE SUBTOOL TYPES
        //WHICH WON'T WORK IN A PARAMS OBJECT WITHOUT A SPECIAL CASE. UH OH. (for the nonce
        // I will assume there is only one at a time.)

        const filters = [
            ...formatFilters('toolTypes', this.props.resource), 
            ...formatFilters('researchAreas', this.props.resource), 
            ...formatFilters('researchTypes', this.props.resource)
        ];

        return filters.map(({
            filter,
            filterType,
            label,
        }, idx) => {
            return (
                <BrowseTile
                    key={ idx }
                    label={ label }
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
        pocs,
        resourceAccess,
        docs,
    }) => {
        return (
            <div className='r4r-resource'>
                <Helmet>
                    <title>Resources for Researchers: { title } - National Cancer Institute</title>
                    <meta property="og:description" content={ description.substr(0, 300) } />
                    <meta name="description" content={ description.substr(0, 300) } />
                    <meta property="twitter:title" content={`Resources for Researchers: ${ title } - National Cancer Institute`} />
                    <meta property="og:url" content={`https://www.cancer.gov/research/r4r/resource/${ id }`} />
                </Helmet>
                <h1>{ title }</h1>
                {
                    /* TODO: Refactor into a more functional approach */
                    this.props.currentResults && this.props.currentResults.includes(this.props.resource) &&
                        <div 
                            className="resource__back" 
                            onClick={ this.props.history.goBack }
                            onKeyPress={ keyHandler({
                                fn: this.props.history.goBack,
                            })}
                            tabIndex="0"
                            role="link"
                        >
                            <p>&lt; Back to results</p>
                        </div>
                }
                <article aria-label="Resource description">
                    <MultiLineText text={ description }/>
                </article>
                <a href={ website }>Learn more about { title } ></a>
                <article>
                    <h2>Contact Information</h2>
                    { 
                        pocs.map((poc, idx) => (
                            <ContactInformation contact={ poc } key={ idx } />
                        ))
                    }
                </article>
                <article className="resource__docs" aria-label="DOCs information">
                    { renderDocsString(docs) }
                </article>
                <article aria-label="Resource Access Information">
                    <h2 className="resource__access">Resource Access</h2>
                    <div className='dummy-access-section'>
                        {/* TODO: Logo based on resourceAccess.type */}
                        <p>{ resourceAccess.type }</p>
                        <p>{ resourceAccess.notes }</p>
                    </div>
                </article>
                <nav>
                    <h2>Find Similar Resources</h2>
                    <div className='similar-resource__container'>
                        { this.renderSimilarResources() }
                    </div>
                </nav>
                <section role="search">
                    <h2>Search Resources</h2>
                    <SearchBar 
                        value={ this.props.searchBarValue }
                        onChange={ this.props.searchBarOnChange }
                        onSubmit={ this.newTextSearch }
                        page='resource'
                    />
                </section>
            </div>
        )
    }

    render() {
        if(this.props.resource && this.props.match.params.id === this.props.resource.id) {
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