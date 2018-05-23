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
    unmountResultsView,
} from '../../state/api/actions';
import {
    updateSearchBar,
} from '../../state/searchForm/actions'
import {
    transformFacetFiltersIntoParamsObject,
} from '../../utilities';
import {
    memoizeSelectedFilters,
} from '../../utilities/reselectHelpers';
import SelectedFiltersBox from '../../components/SelectedFiltersBox';
import Filters from '../../components/Filters';
import ResultTile from '../../components/ResultTile';
import Spinner from '../../components/CTS_Spinner';
import SearchBar from '../../components/SearchBar';
import Pager from '../../components/Pager';
import PagerCounter from '../../components/PagerCounter';
import NoResults from '../../components/NoResults';
import NoTouch from '../../components/NoTouch';
import queryString from 'query-string';
import '../../polyfills/object_entries';
import {
    resourceInterface
} from '../../interfaces';
import './index.css';

export class Results extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            /**
             * FYI, This is the only instance of local state in the app. 
             */
            isMobileMenuOpen: false,
            isMobile: false,
        }
        this.mediaQueryListener = window.matchMedia('(max-width: 1024px)');
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

    // Execute search with filters based only on 
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
        if(prevProps && this.props.facets !== prevProps.facets) {
            // 2) Generate new search based on current filters state
            const paramsObject = transformFacetFiltersIntoParamsObject(this.props.facets);
            paramsObject.q = this.props.currentSearchText;
            if(this.props.startFrom){
                paramsObject.from = this.props.startFrom;
            }
            this.props.newSearch(paramsObject);
        }

        // ...and to the URL querystring
        if(prevProps.location.search && prevProps.location.search !== this.props.location.search) {
            console.log('User navigation triggered results page refresh')
            this.newFullSearch();      
        }
    }

    componentWillUnmount() {
        this.mediaQueryListener.removeListener(this.mediaQueryEvent);
        this.props.unmountResultsView();
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
                        </Theme>
                        <Theme element="section" className="results__search-container">
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
                                                `Filter${ this.props.selectedFilters.length ? ` (${ this.props.selectedFilters.length })` : '' }` 
                                            : 
                                                'Done' 
                                        }
                                    </Theme>
                            }
                        </Theme>
                        <div className="results__selections-container">
                            <SelectedFiltersBox
                                selected={ this.props.selectedFilters }
                                clearFilters={ this.props.clearFilters }
                                toggleFilter={ this.toggleFilter }
                            />
                        </div>
                        <Theme element="nav" className="r4r-pager">
                            {
                                this.props.results &&
                                    <PagerCounter
                                        from={ this.props.startFrom + 1 }
                                        to={ this.props.startFrom + this.props.results.length }
                                        total={ this.props.totalResults }
                                    />
                            }
                            {
                                !this.state.isMobileMenuOpen &&
                                    <Pager
                                        total={ this.props.totalResults }
                                        resultsSize={ this.props.results && this.props.results.length }
                                        startFrom={ this.props.startFrom }
                                        onClick={ this.pagerSearch }
                                    />
                            }
                        </Theme>
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
                        <Theme element="nav" className="r4r-pager">
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
                        </Theme>
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
    selectedFilters: memoizeSelectedFilters(api),
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
    unmountResultsView,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Results));