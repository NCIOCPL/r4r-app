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
        if(this.props.searchBarValue) {
            this.props.clickEvent('Search BTN', {
                keyword: this.props.searchBarValue,
            })
            this.props.newSearch({
                q: this.props.searchBarValue,
                from: 0,
            });
        }
    }

    newFilterSearch = ({filterType, filter}) => () => {
        this.props.clickEvent('Browse Resource', {
            filterType,
            filter
        })
        this.props.newSearch({ 
            [filterType]: filter,
            from: 0,
        });
    }

    viewAllOnClick = () => {
        this.props.clickEvent('View All');
        this.props.newSearch({
            from: 0,
        });
    }

    componentDidMount() {
        this.props.loadFacets();
    }

    componentWillUnmount(){
        //TODO: custom unmount action (UI actions) more declarative
        this.props.setFetchingStatus(false);
    }

    render() {
        return (
            <Theme element="div" className="r4r-home">
                <Helmet>
                    <meta property="og:description" content="Resources for Researchers is a tool to give researchers a better understanding of the various tools available to them." />
                    <meta property="og:url" content="https://www.cancer.gov/research/r4r" />
                </Helmet>
                <h1>Resources for Researchers</h1>
                <Theme element="main" className="home__main">
                    <Theme element="article" className="home__desc">
                        <p>
                            Resources for Researchers is a directory of tools and services developed by NCI to support investigators and expedite cancer research. Most resources are free of cost and available to anyone.&nbsp;
                            <Theme element="a" className="r4r__link--about" href="https://www-blue-dev.cancer.gov/research/about-r4r">Learn more about Resources for Researchers ></Theme>
                        </p>
                    </Theme>
                </Theme>
                <Theme element="nav" className="home-nav">
                    <Theme element="div" className="home-nav__tiles">
                        <Theme element="div" className="home-nav__tile">
                            <SVG iconType="viewAllIcon" className="home-tile__icon" />
                            <Theme element="div" className='home__view-all'>
                                <a
                                    /* This is used instead of a pseudo element because of cgov outline styles being disabled */
                                    onClick={ this.viewAllOnClick }
                                    onKeyPress={ keyHandler({
                                        fn: this.viewAllOnClick,
                                    })}
                                    tabIndex="0"
                                >
                                    <h2> { `View All Resources${ this.props.totalResources ? ` (${ this.props.totalResources })` : '' }` }</h2>
                                </a>
                            </Theme>
                        </Theme>
                        <Theme element="div" className="home-nav__tile">
                            <SVG iconType="searchIcon" className="home-tile__icon" />
                            <Theme element="div" className='home__search'>
                                <h2>Search Resources</h2>
                                <SearchBar
                                    value={ this.props.searchBarValue }
                                    onChange={ this.props.searchBarOnChange }
                                    onSubmit={ this.newTextSearch }
                                    placeholder="Find NCI-supported resources"
                                    page='home'
                                />
                            </Theme>
                        </Theme>
                        <Theme element="div" className="home-nav__tile">
                            <SVG iconType="browseIcon" className="home-tile__icon"/>
                            <h2>Browse Resources</h2>
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
}) => ({
    referenceFacets: memoizeReferenceFacets(api),
    totalResources: api.referenceTotalResources,
    searchBarValue: searchForm.searchBarValues.home,
    isFetching: api.isFetching,
})

const mapDispatchToProps = {
    clickEvent,
    newSearch,
    loadFacets,
    searchBarOnChange: updateSearchBar,
    setFetchingStatus,
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);