import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
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
import NoResults from '../../components/NoResults';
import NoTouch from '../../components/NoTouch';
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
        console.log('constructor', props)
        this.state = {
            /**
             * This is the only instance of local state in the app. Both calculations can be handled through the reducers
             * in a refactor.
             */
            isMobileMenuOpen: false,
            selectedFilters: [],
            isMobile: false,
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
            param: PropTypes.oneOf(['toolTypes', 'toolSubtypes', 'researchAreas', 'researchTypes']),
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
        const paramsObjectFinal = {
            ...paramsObject,
            ...from,
            q: this.props.currentSearchText,
        };
        this.props.newSearch(paramsObjectFinal);        
    }

    toggleFilter = (filterType) => (filterKey) => () => {
        this.props.updateFilter(filterType, filterKey);
    }

    toggleMobileMenu = () => {
        this.setState({ isMobileMenuOpen: !this.state.isMobileMenuOpen });
    }

    newFullSearch = () => {
        const unparsedQueryString = this.props.location.search;
        const parsedQueryParams = queryString.parse(unparsedQueryString);
        this.props.newSearch(parsedQueryParams);
    }
    
    componentDidMount() {
        console.log('mount', this.props)
        this.newFullSearch();
        this.mediaQueryListener.addListener(this.mediaQueryEvent);
    }

    componentDidUpdate(prevProps, prevState) {
        if(!prevProps) {
            // The first time data is available for this to run we need to call it (since the data isn't requested until componentDidMount)
            /**
             * getCurrentlySelectedFiltersFromFacets:
             * This method is an expensive nested reduce over nested arrays representing objects.
             * This note serves as a reminder of where overhead gains can be made in the event of slowdown 
             * (being a light app, we will defer these optimizations for now).
             */
            this.setState({
                selectedFilters: getCurrentlySelectedFiltersFromFacets(this.props.facets)
            });
        }
        // Watch only for changes to the filters...
        if(prevProps.facets && this.props.facets !== prevProps.facets) {
            console.log('Filters have been updated')
            // 1) Update local state watcher of selected filters
            this.setState({
                selectedFilters: getCurrentlySelectedFiltersFromFacets(this.props.facets)
            });

            // Generate new search based on current filters state
            const paramsObject = transformFacetFiltersIntoParamsObject(this.props.facets);
            paramsObject.q = this.props.currentSearchText;
            if(this.props.startFrom){
                paramsObject.from = this.props.startFrom;
            }
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
                        {
                            this.props.isFetching &&
                                <NoTouch />
                        }
                        <Theme element="header" className="results__header">
                            <h1>Resources for Researchers Search Results</h1>
                            <Link to="/">Resources for Researchers Home</Link>
                            <SearchBar 
                                value={ this.props.searchBarValue }
                                onChange={ this.props.searchBarOnChange }
                                onSubmit={ this.newTextSearch }
                                page='results'                            
                            />
                            {
                                /* Don't show the filter button when there are no results to filter */
                                !!this.props.results.length &&
                                    <Theme
                                        element="button"
                                        className="results__filter-button"
                                        onClick={ this.toggleMobileMenu }
                                    >
                                        { 
                                            !this.state.isMobileMenuOpen 
                                            ? 
                                                `Filter (${ this.state.selectedFilters.length })` 
                                            : 
                                                'Done' 
                                        }
                                    </Theme>
                            }
                        </Theme>
                        {
                            <SelectedFiltersBox
                                selected={ this.state.selectedFilters }
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
                                {
                                    this.props.results.length 
                                    ?
                                        <React.Fragment>
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
                                        </React.Fragment>
                                    :
                                        <NoResults />
                                }
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
    isFetching: api.isFetching,
})

const mapDispatchToProps = {
    newSearch,
    updateFilter,
    clearFilters,
    searchBarOnChange: updateSearchBar,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Results));