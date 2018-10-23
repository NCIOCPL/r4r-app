import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Theme } from '../../theme';
import SearchBar from '../../components/SearchBar';
import BrowseBox from '../../components/BrowseBox';
import { 
    updateSearchBar,
} from '../../state/searchForm/actions';
import { 
    loadFacets,
    searchRedirect as newSearch,
    setFetchingStatus,
    clickEvent,
} from '../../state/api/actions';
import {
    memoizeReferenceFacets
} from '../../utilities/reselectHelpers';
import {
    keyHandler,
} from '../../utilities';
import './index.css';
import SVG from '../../components/SVG';

export class Home extends React.Component {
    static propTypes = {
        searchBarValue: PropTypes.string,
        newSearch: PropTypes.func.isRequired,
        loadFacets: PropTypes.func.isRequired,
        searchBarOnChange: PropTypes.func.isRequired,
        referenceFacets: PropTypes.objectOf(PropTypes.shape({
            title: PropTypes.string.isRequired,
            items: PropTypes.objectOf(PropTypes.shape({
                label: PropTypes.string.isRequired,
                count: PropTypes.number.isRequired,
                selected: PropTypes.bool.isRequired,
            }))
        }))
    }

    newTextSearch = () => {
        // We don't want to execute a search on an empty string
        this.props.clickEvent('r4r_home_searchbar', {
            keyword: this.props.searchBarValue,
        })
        this.props.newSearch({
            q: this.props.searchBarValue,
            from: 0,
        });
    }

    newFilterSearch = ({filterType, filter}) => () => {
        this.props.clickEvent('r4r_home_filteredsearch', {
            filterType,
            filter
        })
        this.props.newSearch({ 
            [filterType]: filter,
            from: 0,
        });
    }

    viewAllOnClick = () => {
        this.props.clickEvent('r4r_home_viewall');
        this.props.newSearch({
            from: 0,
        });
    }

    componentDidMount() {
        this.props.loadFacets();
    }

    componentWillUnmount(){
        this.props.setFetchingStatus(false);
    }

    render() {
        return (
            <Theme element="div" className="r4r-home">
                <h1>Resources for Researchers</h1>
                <Theme element="main" className="home__main">
                    <Theme element="article" className="home__desc">
                        <p>
                            Resources for Researchers is a directory of NCI-supported tools and services for cancer researchers. Most resources are free of cost and available to anyone.&nbsp;
                            <Theme element="a" className="r4r__link--about" href="https://www.cancer.gov/research/resources/about">Learn more about Resources for Researchers.</Theme>
                        </p>
                    </Theme>
                </Theme>
                <Theme element="nav" className="home-nav">
                    <Theme element="div" className="home-nav__tiles">
                        <Theme element="div" className="home-nav__tile">
                            <SVG iconType="searchIcon" className="home-tile__icon" />
                            <div className="home-tile__text">
                                <h2>Search For Resources</h2>
                                <p>Search for resources by keyword or phrase.</p>
                            </div>
                        </Theme>
                        <Theme element="div" className="home-nav__tile">
                            <SearchBar
                                value={ this.props.searchBarValue }
                                onChange={ this.props.searchBarOnChange }
                                onSubmit={ this.newTextSearch }
                                placeholder="Search Resources for Researchers"
                                page='home'
                            />
                        </Theme>
                        <Theme element="div" className="home-nav__tile">
                            <SVG iconType="browseIcon" className="home-tile__icon"/>
                            <div className="home-tile__text">
                                <h2>Browse Resources</h2>
                                <p>Browse resources by tool type or research area or view all resources.</p>
                            </div>
                        </Theme>
                        <Theme element="div" className="home-nav__tile">
                            <Theme element="a" className="view-all__link"
                                /* This is used instead of a pseudo element because of cgov outline styles being disabled */
                                onClick={ this.viewAllOnClick }
                                onKeyPress={ keyHandler({
                                    fn: this.viewAllOnClick,
                                })}
                                tabIndex="0"
                            >
                                { `View All Resources${ this.props.totalResources ? ` (${ this.props.totalResources })` : '' }` }
                            </Theme>
                        </Theme>
                    </Theme>
                    <Theme element="div" className="home-nav__main">
                        <Theme element="div" className="home-nav__section" aria-label="Browse by Tool Type">
                            <Theme element="h4" className="home-nav__title">Tool Type</Theme>
                            {
                                <BrowseBox
                                    facets={ this.props.referenceFacets }
                                    filterType={ 'toolTypes' }
                                    searchFunction={ this.newFilterSearch }
                                    isFetching={ this.props.isFetching }
                                    displayCount={ true }
                                />
                            }
                        </Theme>
                        <Theme element="div" className="home-nav__section" aria-label="Browse by Research Area">
                            <Theme element="h4" className="home-nav__title">Research Area</Theme>
                            {
                                <BrowseBox
                                    facets={ this.props.referenceFacets }
                                    filterType={ 'researchAreas' }
                                    searchFunction={ this.newFilterSearch }
                                    isFetching={ this.props.isFetching }
                                    displayCount={ true }
                                />
                            }
                        </Theme>
                    </Theme>         
                </Theme>
            </Theme>
        )
    }
}

const mapStateToProps = ({
    searchForm,
    api,
    settings,
}) => ({
    referenceFacets: memoizeReferenceFacets(api),
    totalResources: api.referenceTotalResources,
    searchBarValue: searchForm.searchBarValues.home,
    isFetching: api.isFetching,
    baseUrl: settings.baseUrl,
})

const mapDispatchToProps = {
    clickEvent,
    newSearch,
    loadFacets,
    searchBarOnChange: updateSearchBar,
    setFetchingStatus,
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
