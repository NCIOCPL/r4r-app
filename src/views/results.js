import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { push } from "react-router-redux";
import { Theme } from "../theme";
import {
  newSearch,
  validatedNewSearch,
  setCurrentSearchText,
  searchRedirect,
  unmountResultsView,
  clickEvent,
} from "../state/api/actions";
import { updateSearchBar } from "../state/searchForm/actions";
import {
  updateFacetFilters,
  transformFacetFiltersIntoParamsObject,
} from "../utilities";
import {
  memoizeSelectedFilters,
  memoizeFacetFilters,
} from "../utilities/reselectHelpers";

import {
  Filters,
  FilterButton,
  Pager,
  PagerCounter,
  NoResults,
  NoTouch,
  ResultTile,
  SearchBar,
  SelectedFiltersBox,
  Spinner,
} from "../components";

import "../polyfills/object_entries";
import queryString from "query-string";
import { resourceInterface } from "../interfaces";
import "./results.css";

export class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobileMenuOpen: false,
      isMobile: false,
    };
    this.mediaQueryListener = window.matchMedia("(max-width: 1024px)");
  }

  static propTypes = {
    newSearch: PropTypes.func,
    searchRedirect: PropTypes.func,
    updateSearchBar: PropTypes.func,
    totalResults: PropTypes.number,
    startFrom: PropTypes.number,
    searchBarValue: PropTypes.string,
    currentSearchText: PropTypes.string,
    facets: PropTypes.objectOf(
      PropTypes.shape({
        title: PropTypes.string,
        param: PropTypes.oneOf([
          "toolTypes",
          "toolSubtypes",
          "researchAreas",
          "researchTypes",
        ]),
        items: PropTypes.objectOf(
          PropTypes.shape({
            label: PropTypes.string,
            count: PropTypes.number,
            selected: PropTypes.bool,
          }),
        ),
      }),
    ),
    results: PropTypes.arrayOf(resourceInterface),
    location: PropTypes.shape({
      search: PropTypes.string,
    }),
  };

  // We want to make sure that the mobile filter menu closes automatically if the window resizes above the mobile
  // breakpoint
  mediaQueryEvent = (e) => {
    if (!e.matches) {
      this.setState({ isMobileMenuOpen: false });
    }
  };

  newTextSearch = () => {
    // Do not execute on empty search fields
    this.props.clickEvent("r4r_results_searchbar", {
      keyword: this.props.searchBarValue,
    });
    this.props.searchRedirect({
      q: this.props.searchBarValue,
    });
    this.setState({ isMobileMenuOpen: false });
  };

  // This is exclusively being used for custom event reporting, passed as a callback to results tiles
  resultsTileOnClick = (index, title) => () => {
    this.props.clickEvent("r4r_results|result_click", {
      localIndex: index,
      totalResults: this.props.totalResults,
      startFrom: this.props.startFrom,
      pageSize: 20,
      filters: this.props.selectedFilters,
      title,
    });
  };

  clearFilters = () => {
    if (this.props.searchBarValue) {
      this.props.searchRedirect({
        q: this.props.searchBarValue,
      });
    } else {
      this.props.searchRedirect({
        from: 0,
        size: 20,
      });
    }
  };

  viewAll = () => {
    this.props.clickEvent("r4r_results_viewall");
    this.props.searchRedirect({
      from: 0,
      size: 20,
    });
  };

  pagerSearch = (from) => {
    const paramsObject = transformFacetFiltersIntoParamsObject(
      this.props.facets,
    );
    const paramsObjectFinal = {
      ...paramsObject,
      ...from,
      q: this.props.currentSearchText,
    };
    this.props.searchRedirect(paramsObjectFinal);
  };

  toggleFilter = (filterType) => (filter) => () => {
    const updatedFilters = updateFacetFilters(
      this.props.facets,
      filterType,
      filter,
    );
    const paramsObject = transformFacetFiltersIntoParamsObject(updatedFilters);
    const paramsObjectFinal = {
      ...paramsObject,
      from: 0,
      q: this.props.currentSearchText,
    };
    this.props.searchRedirect(paramsObjectFinal);
  };

  toggleMobileMenu = () => {
    this.setState({ isMobileMenuOpen: !this.state.isMobileMenuOpen });
  };

  // Execute search with filters based only on
  newSearchBasedOnURL = (unvalidatedQueryString) => {
    const searchText = queryString.parse(unvalidatedQueryString).q || "";
    this.props.setCurrentSearchText(searchText);
    this.props.validatedNewSearch(unvalidatedQueryString);
  };

  componentDidMount() {
    this.newSearchBasedOnURL(this.props.location.search);
    this.mediaQueryListener.addListener(this.mediaQueryEvent);
  }

  componentDidUpdate(prevProps, prevState) {
    // Watch only for changes to the URL querystring
    if (
      prevProps.location.search &&
      prevProps.location.search !== this.props.location.search
    ) {
      console.log("Results view updated");
      this.newSearchBasedOnURL(this.props.location.search);
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
          <title>
            Resources for Researchers: Search Results - National Cancer
            Institute
          </title>
          <meta
            property='og:url'
            content={`${this.props.baseUrl}/search${this.props.location.search}`}
          />
          <meta
            property='og:title'
            content='Resources for Researchers: Search Results - National Cancer Institute'
          />
        </Helmet>
        {this.props.results ? (
          <Theme element='div' className='r4r-results'>
            {this.props.isFetching && <NoTouch />}
            <Theme element='header' className='results__header'>
              <h1>Resources for Researchers Search Results</h1>
              <Link to='/'>Resources for Researchers Home</Link>
            </Theme>
            <Theme element='section' className='results__search-container'>
              <SearchBar
                value={this.props.searchBarValue}
                onChange={this.props.updateSearchBar}
                onSubmit={this.newTextSearch}
                page='results'
              />
              {/* Don't show the filter button when there are no results to filter */
              !!this.props.results.length && (
                <FilterButton
                  isMobileMenuOpen={this.state.isMobileMenuOpen}
                  toggleMobileMenu={this.toggleMobileMenu}
                  filtersCount={this.props.selectedFilters.length}
                />
              )}
            </Theme>
            <SelectedFiltersBox
              selected={this.props.selectedFilters}
              clearFilters={this.clearFilters}
              toggleFilter={this.toggleFilter}
            />
            <Theme element='nav' className='r4r-pager'>
              {this.props.results && (
                <PagerCounter
                  from={this.props.startFrom + 1}
                  to={this.props.startFrom + this.props.results.length}
                  total={this.props.totalResults}
                />
              )}
              {!this.state.isMobileMenuOpen && (
                <Pager
                  total={this.props.totalResults}
                  resultsSize={this.props.results && this.props.results.length}
                  startFrom={this.props.startFrom}
                  onClick={this.pagerSearch}
                />
              )}
            </Theme>
            {!this.state.isMobileMenuOpen && (
              <Theme element='div' className='results__main'>
                {this.props.results.length ? (
                  <React.Fragment>
                    <Filters
                      facets={this.props.facets}
                      onChange={this.toggleFilter}
                    />
                    <Theme
                      element='section'
                      className='results-container'
                      aria-label='search results'
                    >
                      {this.props.results.map(
                        ({ title, description, id }, idx) => (
                          <ResultTile
                            key={idx}
                            title={title}
                            onClick={this.resultsTileOnClick(idx, title)}
                            description={description}
                            id={id}
                          />
                        ),
                      )}
                    </Theme>
                  </React.Fragment>
                ) : (
                  <NoResults viewAll={this.viewAll} />
                )}
              </Theme>
            )}
            <Theme element='nav' className='r4r-pager'>
              {!this.state.isMobileMenuOpen && (
                <Pager
                  total={this.props.totalResults}
                  resultsSize={this.props.results && this.props.results.length}
                  startFrom={this.props.startFrom}
                  onClick={this.pagerSearch}
                  withCounter={false}
                />
              )}
            </Theme>
            {this.state.isMobileMenuOpen && (
              <Filters
                facets={this.props.facets}
                onChange={this.toggleFilter}
              />
            )}
          </Theme>
        ) : (
          <Spinner />
        )}
      </React.Fragment>
    );
  }
}

export const mapStateToProps = ({ api, searchForm, router, settings }) => ({
  results: api.currentResults,
  facets: memoizeFacetFilters(api),
  selectedFilters: memoizeSelectedFilters(api),
  currentSearchText: api.currentSearchText,
  searchBarValue: searchForm.searchBarValues.results,
  totalResults: api.currentMetaData && api.currentMetaData.totalResults,
  startFrom: api.currentMetaData && api.currentMetaData.from,
  isFetching: api.isFetching,
  location: router.location,
  baseUrl: settings.baseUrl,
});

const mapDispatchToProps = {
  push,
  clickEvent,
  newSearch,
  validatedNewSearch,
  searchRedirect,
  updateSearchBar,
  unmountResultsView,
  setCurrentSearchText,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Results);
