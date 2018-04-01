import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { 
    newSearch,
    captureFilterState, 
} from '../../state/api/actions';
import FilterBox from '../../components/FilterBox';
import ResultTile from '../../components/ResultTile';
import Spinner from '../../components/ScienceSpinner';
import queryString from 'query-string';
import {
    formatFilters,
} from '../../utilities'
import './index.css';

//NOTE: Maybe the searching spinner should happen on the search page and this page only rendered
// when results are returned (however if someone is linked directly here from an external site
// that would be a different flow. Hmm.)

// TOOL SUBTYPE CREATES A LOT OF IDIOSYNCRATIC ISSUES FOR AN EXTENSIBLE APPROACH. SHOULD BE A FLAT HIERARCHY!

class Results extends React.PureComponent {
    componentDidMount() {
        // Check to see if a cached query string exists and commensurate results.
        // Populate from those if possible.
        // Otherwise:
        // We will want to execute a search based on the query params when the component mounts
        // Most of the page will be dynamically rendered based on the results object in the store
        // This includes the state of the filters, the state of the pager, the filters tiles, and
        // potentially the new search bar if we go down that road.
        const unparsedQueryString = this.props.location.search;
        this.props.newSearch(unparsedQueryString);
        //After the search concludes we want to update the state of the page filters based on the 
        // parsed query string. Controlling that flow is an as yet unanswered implementation question.
        // For now we can draw the filters initially based on whatever is in the currentFacets box and
        // then redraw when it changes 
        const params = this.parseAndSetQueryStringParamsAsFilters(unparsedQueryString);

    }
    
    parseAndSetQueryStringParamsAsFilters = unparsedQueryString => {
        const params = queryString.parse(unparsedQueryString);
        return params;
    }

    // getDerivedStateFromProps(nextProps, nextState) {
    //     console.log(nextProps)
    // }

    // This is going to be a highly idiosyncratic process of normalizing the data
    renderSelectedFilters = () => {
        const selected = Object.values(this.props.facets).reduce((acc, facet) => {
            const filters = facet.items.reduce((acc, filter) => {
                if(filter.selected) {
                    const filterContext = {
                        ...filter,
                        title: facet.title,
                        param: facet.param,
                    }
                    return [...acc, filterContext]
                }
                return acc;
            }, [])
            return [...acc, ...filters];
        }, [])

        return selected.map((filter, idx) => (
            <div 
                key={ idx }
                className="selected-filters__filter"
            >
                <p>{`${filter.title}: `} <span>{filter.label}</span> X</p>
            </div>
        ))
    }

    // TODO: When the returned query populates the local state flags for filters, refactor this to render
    // based on those filter flags, not the raw results
    renderToolTypes = () => {
        const toolTypesFacet = this.props.facets['toolTypes'];
        const toolTypes = this.props.facets['toolTypes'].items;
        const isToolTypeSelected = toolTypes.some(el => el.selected);
        return !isToolTypeSelected
            ?   <FilterBox 
                    className="tool-types"
                    facet={ this.props.facets['toolTypes'] }
                />
            : this.props.facets['st'] && this.props.facets['st'].items
            ?   <FilterBox
                    className="subtool-types"
                    facet={ this.props.facets['st'] }
                />
            : null
    }

    render() {
        return (
            this.props.results 
                ?
                    <React.Fragment>
                        <div className="results__header">
                            <h1>Resources for Researchers: Search Results</h1>
                            <div className='results__count-container'>
                                <h2>We found {this.props.results.length} results that match your search</h2>
                                <h2><Link to="/">Start Over</Link></h2>
                            </div>
                        </div>
                        <div className="results__selected-filters">
                            <h4 className="selected-filters__header">Your selections:</h4>
                            <div className="selected-filters__filters-container">
                                { this.renderSelectedFilters() }
                            </div>
                        </div>
                        {/* Selected filters tiles (abstract to component with click callback)*/}
                        <div className="dummy-flex-search-container">
                            <div className="selected-container">
                            </div>
                            <div className="results__facets">
                                {/* TODO: Tool Type can't behave like the other filters and show sibling options 
                                    need a different kind of component.
                                    Brute force: if a tooltype is selected (map the array on each rerender) then
                                    don't render it and instead render subtool type.
                                    The function below should be heavily refactored when approach is determined
                                */}
                                { this.renderToolTypes() }
                                <FilterBox 
                                    facet={ this.props.facets['ra'] }
                                />
                                <FilterBox 
                                    facet={ this.props.facets['rt'] }
                                />
                            </div>
                            <div className="results-container">
                                {/* Results Tiles */}
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
                            </div>
                        </div>
                        {/* Results pager */}
                    </React.Fragment>
                :
                    <Spinner />
        )
    }
}

const mapStateToProps = ({ api }) => ({
    results: api.currentResults,
    facets: api.currentFacets,
})

const mapDispatchToProps = {
    newSearch,
    captureFilterState,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Results));