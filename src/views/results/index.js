import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Theme } from '../../theme';
import { 
    newSearch,
    updateFilter,
    clearFilters,
} from '../../state/api/actions';
import {
    updateSearchBar,
} from '../../state/searchForm/actions'
import {
    getCurrentlySelectedFiltersFromFacets,
    transformFacetFiltersIntoParamsObject,
} from '../../utilities';
import SelectedFiltersBox from '../../components/SelectedFiltersBox';
import Filters from '../../components/Filters';
import ResultTile from '../../components/ResultTile';
import Spinner from '../../components/ScienceSpinner';
import SearchBar from '../../components/SearchBar';
import Pager from '../../components/Pager';
import queryString from 'query-string';
import '../../polyfills/object_entries';
import {
    resourceInterface
} from '../../interfaces';
import './index.css';

//TODO: NOTE: Maybe the searching spinner should happen on the search page and this page only rendered
// when results are returned (however if someone is linked directly here from an external site
// that would be a different flow. Hmm.)

class Results extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            isMobileMenuOpen: false,
        }
        this.mediaQueryListener = window.matchMedia('(max-width: 768px)');
    }

    static propTypes = {
        newSearch: PropTypes.func.isRequired,
        updateFilter: PropTypes.func.isRequired,
        clearFilters: PropTypes.func.isRequired,
        searchBarOnChange: PropTypes.func.isRequired,
        totalResults: PropTypes.number,
        startFrom: PropTypes.number,
        searchBarValue: PropTypes.string,
        currentSearchText: PropTypes.string,
        facets: PropTypes.objectOf(PropTypes.shape({
            title: PropTypes.string.isRequired,
            param: PropTypes.oneOf(['toolTypes', 'toolTypes.subtype', 'researchAreas', 'researchTypes']),
            items: PropTypes.objectOf(PropTypes.shape({
                label: PropTypes.string.isRequired,
                count: PropTypes.number.isRequired,
                selected: PropTypes.bool.isRequired,
            }))
        })),
        results: PropTypes.arrayOf(resourceInterface),
    }

    // We want to make sure that the mobile filter menu closes automatically if the window resizes above the mobile
    // breakpoint
    mediaQueryEvent = e => {
        if(!e.matches) {
            this.setState({isMobileMenuOpen: false})
        }
    }

    newTextSearch = () => {
        // Do not execute on empty search fields
        if(this.props.searchBarValue) {
            this.props.newSearch({
                q: this.props.searchBarValue
            });
        }
        this.setState({ isMobileMenuOpen: false });
    }

    clearFilters = () => {
        if(this.props.searchBarValue) {
            this.props.newSearch({
                q: this.props.searchBarValue
            });
        }
        else {
            this.props.newSearch({
                from: 0,
                size: 20,
            })
        }
    }

    pagerSearch = from => {
        const paramsObject = transformFacetFiltersIntoParamsObject(this.props.facets);
        //TODO: Need to account for searchText (as well as any other options (from, size...))
        const paramsObjectFinal = {
            ...paramsObject,
            ...from,
        };
        // Only send text if textfield is populated
        if(this.props.currentSearchText){
            paramsObjectFinal['q'] = this.props.currentSearchText
        }
        this.props.newSearch(paramsObjectFinal);        
    }

    toggleFilter = (filterType) => (filterKey) => () => {
        this.props.updateFilter(filterType, filterKey);
    }

    newFullSearch = () => {
        const unparsedQueryString = this.props.location.search;
        const parsedQueryParams = queryString.parse(unparsedQueryString);
        this.props.newSearch(parsedQueryParams);
    }
    
    componentDidMount() {
        this.newFullSearch();
        this.mediaQueryListener.addListener(this.mediaQueryEvent);
    }

    componentDidUpdate(prevProps, prevState) {
        // Watch only for changes to the filters...
        if(prevProps.facets && this.props.facets !== prevProps.facets) {
            console.log('Filters have been updated')
            // Generate new search based on current filters state
            const paramsObject = transformFacetFiltersIntoParamsObject(this.props.facets);
            //TODO: Need to account for searchText (as well as any other options (from, size...))
            paramsObject.q = this.props.currentSearchText;
            this.props.newSearch(paramsObject);
        }

        // ...and to the URL querystring
        if(prevProps.location.search && prevProps.location.search !== this.props.location.search) {
            console.log('User navigation triggered refresh')
            this.newFullSearch();      
        }
    }

    componentWillUnmount() {
        this.mediaQueryListener.removeListener(this.mediaQueryEvent);
    }

    render() {
        return (
            <React.Fragment>
                <Helmet>
                    <title>Resources for Researchers: Search Results - National Cancer Institute</title>
                    <meta property="og:description" content="Resources for Researchers is a tool to give researchers a better understanding of the various tools available to them." />
                    <meta property="og:url" content="https://www.cancer.gov/research/r4r/search" />
                    <meta property="twitter:title" content="Resources for Researchers: Search Results - National Cancer Institute" />
                </Helmet>
            {
                this.props.results 
                ?
                    <Theme element="div" className="r4r-results">
                        <Theme element="header" className="results__header">
                            <h1>Search Results</h1>
                            <SearchBar 
                                value={ this.props.searchBarValue }
                                onChange={ this.props.searchBarOnChange }
                                onSubmit={ this.newTextSearch }
                                page='results'                            
                            />
                            <Theme
                                element="button"
                                className="results__filter-button"
                                onClick={() => this.setState({ isMobileMenuOpen: !this.state.isMobileMenuOpen })}
                            >
                                { !this.state.isMobileMenuOpen ? 'Filter' : 'Done' }
                            </Theme>
                        </Theme>
                        {
                            !this.state.isMobileMenuOpen &&
                                <SelectedFiltersBox 
                                    selected={ getCurrentlySelectedFiltersFromFacets(this.props.facets) }
                                    clearFilters={this.props.clearFilters}
                                    toggleFilter={this.toggleFilter}
                                />
                        }
                        {
                            !this.state.isMobileMenuOpen &&
                                <Pager
                                    total={ this.props.totalResults }
                                    resultsSize={ this.props.results && this.props.results.length }
                                    startFrom={ this.props.startFrom }
                                    onClick={ this.pagerSearch }
                                    withCounter={ true }
                                />
                        }
                        {
                            !this.state.isMobileMenuOpen &&
                                <Theme element="div" className="results__main">
                                    <Filters
                                        facets={ this.props.facets }
                                        onChange={ this.toggleFilter }
                                    />
                                    <Theme element="section" className="results-container" aria-label="search results">
                                        {
                                            this.props.results.map(({
                                                title,
                                                description,
                                                id
                                            }, idx) => (
                                                <ResultTile
                                                    key={ idx }
                                                    title={ title }
                                                    description={ description }
                                                    id={ id }
                                                />
                                            ))
                                        }
                                    </Theme>
                                </Theme>
                        }
                        {
                            !this.state.isMobileMenuOpen &&
                                <Pager
                                    total={ this.props.totalResults }
                                    resultsSize={ this.props.results && this.props.results.length }
                                    startFrom={ this.props.startFrom }
                                    onClick={ this.pagerSearch }
                                    withCounter={ false }
                                />

                        }
                        {
                            this.state.isMobileMenuOpen &&
                                <Filters
                                    facets={ this.props.facets }
                                    onChange={ this.toggleFilter }
                                />
                        }
                    </Theme>
                :
                    <Spinner />
            }
            </React.Fragment>
        )
    }
}

const mapStateToProps = ({ api, searchForm }) => ({
    results: api.currentResults,
    facets: api.currentFacets,
    currentSearchText: api.currentSearchText,
    searchBarValue: searchForm.searchBarValues.results,
    totalResults: api.currentMetaData && api.currentMetaData.totalResults,
    startFrom: api.currentMetaData && api.currentMetaData.from,
})

const mapDispatchToProps = {
    newSearch,
    updateFilter,
    clearFilters,
    searchBarOnChange: updateSearchBar,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Results));