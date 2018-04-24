import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Theme } from '../../theme';
import SearchBar from '../../components/SearchBar';
import BrowseBox from '../../components/BrowseBox';
import MultiLineText from '../../components/MultiLineText';
import { 
    updateSearchBar,
} from '../../state/searchForm/actions';
import { 
    loadFacets,
    newSearch,
} from '../../state/api/actions';
import {
    keyHandler,
} from '../../utilities';
import './index.css';

class Home extends React.PureComponent {
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
            this.props.newSearch({
                q: this.props.searchBarValue,
            });
        }
    }

    // If I want to make this reusable for resource page it's going to have to be able to accomodate
    // type/subtype combinations potentially TODO: verify this
    newFilterSearch = ({filterType, filter}) => () => {
        this.props.newSearch({ 
            [filterType]: filter,
        });
    }

    viewAllOnClick = () => {
        // TODO: This exact search params for view all needs to be confirmed with Sarina/Bryan
        this.props.newSearch({
            'from': '0',
            'size': '20',
        });
    }

    componentDidMount() {
        this.props.loadFacets();
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
                    <Theme element="div" className='home__search'>
                        <SearchBar
                            value={ this.props.searchBarValue }
                            onChange={ this.props.searchBarOnChange }
                            onSubmit={ this.newTextSearch }
                            placeholder="Search for resources and tools"
                            page='home'
                        />
                    </Theme>
                    <Theme element="article" className="home__desc">
                        <MultiLineText
                            text={ "I went out to a hazel wood because a fire was in my head. I cut and peeled a hazel wand and hooked a berry to a thread. And when white moths were on the wing, and moth-like stars were flickering out, I dropped the berry in a stream and caught a little, silver trout.\nWhen I had laid it on the floor, I went to blow the fire aflame. But something rustled on the floor and someone called me by my name." }
                            />
                        <Theme element="a" className="r4r__link--about" href="#i-am-a-dummyuurl">About Resources for Researchers ></Theme>
                    </Theme>
                </Theme>
                <Theme element="nav" className="home-nav">
                    <Theme element="div" className="home-nav__header">
                        <h2>Find resources by tool type or research area</h2>
                        <Theme element="p" className='r4r__view-all'
                            onClick={ this.viewAllOnClick }
                            onKeyPress={ keyHandler({
                                fn: this.viewAllOnClick,
                            })}
                            tabIndex="0"
                            role="link"
                        >
                            View All Resources >
                        </Theme>
                    </Theme>
                    <Theme element="div" className="home-nav__main">
                        <Theme element="div" className="home-nav__section">
                            <Theme element="h4" className="home-nav__title">Tool Type</Theme>
                            {
                                <BrowseBox
                                    facets={ this.props.referenceFacets }
                                    filterType={ 'toolTypes' }
                                    searchFunction={ this.newFilterSearch }
                                    isFetching={ this.props.isFetchingFacets }
                                />
                            }
                        </Theme>
                        <Theme element="div" className="home-nav__section">
                            <Theme element="h4" className="home-nav__title">Research Area</Theme>
                            {
                                <BrowseBox
                                    facets={ this.props.referenceFacets }
                                    filterType={ 'researchAreas'}
                                    searchFunction={ this.newFilterSearch }
                                    isFetching={ this.props.isFetchingFacets }
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
    searchBarValue: searchForm.searchBarValues.home,
    referenceFacets: api.referenceFacets,
    isFetchingFacets: api.isFetchingFacets,
})

const mapDispatchToProps = {
    newSearch,
    loadFacets,
    searchBarOnChange: updateSearchBar,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));