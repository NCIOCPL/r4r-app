import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
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
    transformFacetFiltersIntoParamsObject,
    keyHandler,
    getCurrentlySelectedFiltersFromFacets,
} from '../../utilities';
import FilterBox from '../../components/FilterBox';
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
            param: PropTypes.oneOf(['toolTypes.type', 'toolTypes.subtype', 'researchAreas', 'researchTypes']),
            items: PropTypes.objectOf(PropTypes.shape({
                label: PropTypes.string.isRequired,
                count: PropTypes.number.isRequired,
                selected: PropTypes.bool.isRequired,
            }))
        })),
        results: PropTypes.arrayOf(resourceInterface),
    }

    newTextSearch = () => {
        // Do not execute on empty search fields
        if(this.props.searchBarValue) {
            this.props.newSearch({
                q: this.props.searchBarValue
            });
        }
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
        //TODO: Only send text if textfield is populated
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

    // This is going to be a highly idiosyncratic process of normalizing the data
    // Move this to a component for clarity
    renderSelectedFilters = () => {
        const selected = getCurrentlySelectedFiltersFromFacets(this.props.facets)

        if(!selected.length) {
            return null;
        }

        return (
            <React.Fragment>
                <Theme element="h4" className="selected-filters__header" aria-hidden>Your selections:</Theme>
                <Theme element="div" className="selected-filters__filters-container">
                {
                    selected.map((filter, idx) => (
                        <Theme
                            element="div" 
                            key={ idx }
                            className="selected-filters__filter"
                            tabIndex="0"
                            onClick={ this.toggleFilter(filter.param)(filter.key) }
                            onKeyPress={ keyHandler({
                                fn: this.toggleFilter(filter.param)(filter.key),
                            })}
                        >
                            <p>{`${filter.title}: `} <span>{filter.label}</span> X</p>
                        </Theme>
                    ))
                }
                {
                    (selected.length > 1) &&
                        <Theme
                            element="div"
                            tabIndex="0"
                            className="selected-filters__filter selected-filters__clear"
                            onClick={ this.props.clearFilters }
                            onKeyPress={ keyHandler({
                                fn: this.props.clearFilters,
                            })}
                        >
                            <p>Clear all</p>
                        </Theme>
                }
                </Theme>
            </React.Fragment>
        )
        
    }

    //TODO: Pass the facet type and facets separately and handle the logic of rendering there
    renderToolTypes = () => {
        if(this.props.facets['toolTypes.type']) {
            const toolTypesTypeFilters = this.props.facets['toolTypes.type'].items;
            const isToolTypeSelected = Object.entries(toolTypesTypeFilters).some(([key, obj]) => obj.selected);
            return !isToolTypeSelected
                ?   <FilterBox 
                        className="tool-types"
                        facet={ this.props.facets['toolTypes.type'] }
                        onChange={ this.toggleFilter('toolTypes.type') }
                    />
                : this.props.facets['toolTypes.subtype'] && this.props.facets['toolTypes.subtype'].items
                ?   <FilterBox
                        className="subtool-types"
                        facet={ this.props.facets['toolTypes.subtype'] }
                        onChange={ this.toggleFilter('toolTypes.subtype') }
                    />
                : null //TODO: Redundant, rework
        }
        return null;
    }
    
    componentDidMount() {
        const unparsedQueryString = this.props.location.search;
        const parsedQueryParams = queryString.parse(unparsedQueryString);
        this.props.newSearch(parsedQueryParams);
    }

    componentDidUpdate(prevProps, prevState) {
        // Watch only for changes to the filters
        if(prevProps.facets && this.props.facets !== prevProps.facets) {
            console.log('Filters have been updated')
            // Generate new search based on current filters state
            const paramsObject = transformFacetFiltersIntoParamsObject(this.props.facets);
            //TODO: Need to account for searchText (as well as any other options (from, size...))
            paramsObject.q = this.props.currentSearchText;
            this.props.newSearch(paramsObject);
        }

        // And to the URL querystring
        if(prevProps.location.search && prevProps.location.search !== this.props.location.search) {
            console.log('User navigation triggered refresh')
            // Same procedure as the first pass in componentDidMount
            const unparsedQueryString = this.props.location.search;
            const parsedQueryParams = queryString.parse(unparsedQueryString);
            this.props.newSearch(parsedQueryParams);       
        }
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
                            <h1>Resources for Researchers: Search Results</h1>

                            <SearchBar 
                                value={ this.props.searchBarValue }
                                onChange={ this.props.searchBarOnChange }
                                onSubmit={ this.newTextSearch }
                                page='results'                            
                            />
                        </Theme>
                        <Theme element="section" className="results__selected-filters" aria-label="Selected Search Filters">
                            { this.renderSelectedFilters() }
                        </Theme>
                        <Pager
                            total={ this.props.totalResults }
                            resultsSize={ this.props.results && this.props.results.length }
                            startFrom={ this.props.startFrom }
                            onClick={ this.pagerSearch }
                            withCounter={ true }
                        />
                        <Theme element="div" className="results__main">
                            <Theme element="section" className="results__facets" aria-label="Search Filters">
                                { this.renderToolTypes() }
                                <FilterBox 
                                    facet={ this.props.facets['researchAreas'] }
                                    onChange={ this.toggleFilter('researchAreas') }
                                />
                                <FilterBox 
                                    facet={ this.props.facets['researchTypes'] }
                                    onChange={ this.toggleFilter('researchTypes') }
                                />
                            </Theme>
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
                        <Pager
                            total={ this.props.totalResults }
                            resultsSize={ this.props.results && this.props.results.length }
                            startFrom={ this.props.startFrom }
                            onClick={ this.pagerSearch }
                            withCounter={ false }
                        />
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