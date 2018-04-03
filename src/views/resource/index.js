import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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
    composeQueryString,
    formatFilters,
} from '../../utilities';
import './index.css';

class Resource extends React.PureComponent {

    newTextSearch = () => {
        this.props.newSearch({
            q: this.props.searchBarValue,
        });
    }

    newFilterSearch = ({filterType, filter}) => () => {
        this.props.newSearch({ [filterType]: filter });
    }

    renderDocsString = (docs = []) => {
        const base = 'This resource is managed by the National Cancer Institute'
        if(!docs.length) {
            return base + '.';
        }
        if(docs.length === 1) {
            return `${ base } and ${ docs[0] }.`;
        }
        const grammarfiedDocs = docs.reduce((acc, doc, idx, arr) => {
            if(idx === arr.length - 1){
                acc = acc + ', and ' + doc;
                return acc;
            }
            acc = acc + ', ' + doc;
            return acc
        })
        return `${ base }, ${ grammarfiedDocs }.`;
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
                />
            )
        })
    }

    componentDidMount() {

        // NOTE: The currentResults or the currentResource might contain it, so we need to check both
        // and in that order. ORRRR, we should be populating a separate cache with the resources (provided
        // what is coming back is the full information (and why shouldn't it be when they are so simple and
        // small??))
        // TODO:
        // On load check to see if cache contains resource matching current pathname
        // If not, fetch the resource
        // Render Dynamically
        // This logic flow can be extracted to a thunk since it just needs to know the params
        // And make a getState query before executing the fetch
        const resourceId = this.props.match.params.id;
        this.props.fetchResource(resourceId);
    }

    renderResource = ({
        title,
        website,
        description,
        pocs,
        resourceAccess,
        docs,
    }) => {
        return (
            <div className='r4r-resource'>
                <h1>{ title }</h1>
                {
                    /* TODO: Refactor into a more functional approach */
                    this.props.currentResults && this.props.currentResults.includes(this.props.resource) &&
                        <div 
                            className="resource__back" 
                            onClick={ this.props.history.goBack }
                        >
                            <p>&lt; Back to results</p>
                        </div>
                }
                <MultiLineText text={ description }/>
                <a href={ website }>Learn more about { title } ></a>
                <h2>Contact Information</h2>
                { 
                    pocs.map((poc, idx) => (
                        <ContactInformation contact={ poc } key={ idx } />
                    ))
                }
                <div className="resource__docs">
                    { this.renderDocsString(docs) }
                </div>
                <h2 className="resource__access">Resource Access</h2>
                <div className='dummy-access-section'>
                    {/* TODO: Logo based on resourceAccess.type */}
                    <p>{ resourceAccess.type }</p>
                    <p>{ resourceAccess.notes }</p>
                </div>
                <h2>Find Similar Resources</h2>
                <div className='similar-resource__container'>
                    { this.renderSimilarResources() }
                </div>
                <h2>Search Resources</h2>
                <SearchBar 
                    value={ this.props.searchBarValue }
                    onChange={ this.props.searchBarOnChange }
                    onSubmit={ this.newTextSearch }
                    page='resource'
                />
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