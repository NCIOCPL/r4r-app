import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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
            <div className="r4r-home">
                <header role="heading">
                    <h1>Resources for Researchers</h1>
                </header>
                <a className="r4r__link--about" href="#i-am-a-dummyuurl">ABOUT RESOURCES FOR RESEARCHERS</a>
                <article>
                    <MultiLineText
                        text={ "I went out to a hazel wood because a fire was in my head. I cut and peeled a hazel wand and hooked a berry to a thread. And when white moths were on the wing, and moth-like stars were flickering out, I dropped the berry in a stream and caught a little, silver trout.\nWhen I had laid it on the floor, I went to blow the fire aflame. But something rustled on the floor and someone called me by my name. It had become a glimmering girl, with apple blossom in her hair, who called me by my name and ran and faded in the brightening air.\nThough I am old with wandering through hollow lands and hilly lands, I will find out where she has gone and kiss her lips and take her hands and walk among long dappled grass and pluck, til time and times are done, the silver apples of the moon, the golden apples of the sun." }
                    />
                </article>
                <div className='search' role="search">
                    <h2>Search for resources and tools</h2>
                    <SearchBar
                        value={ this.props.searchBarValue }
                        onChange={ this.props.searchBarOnChange }
                        onSubmit={ this.newTextSearch }
                        page='home'
                    />
                </div>
                <nav>
                    <h2>Find resources by tool type or research area</h2>

                    <h3>Tool Type</h3>
                    {
                        <BrowseBox
                            facets={ this.props.referenceFacets }
                            filterType={ 'toolTypes.type' }
                            className='tool-types'
                            searchFunction={ this.newFilterSearch }
                            isFetching={ this.props.isFetchingFacets }
                        />
                    }
                    <h3>Research Area</h3>
                    {
                        <BrowseBox
                            facets={ this.props.referenceFacets }
                            filterType={ 'researchAreas'}
                            className='research-areas'
                            searchFunction={ this.newFilterSearch }
                            isFetching={ this.props.isFetchingFacets }
                        />
                    }                

                    <div className='r4r__view-all'>
                        <h2 
                        onClick={ this.viewAllOnClick }
                        onKeyPress={ keyHandler({
                            fn: this.viewAllOnClick,
                        })}
                        tabIndex="0"
                        role="link"
                        >
                            View All Resources >
                        </h2>
                    </div>
                </nav>
            </div>
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