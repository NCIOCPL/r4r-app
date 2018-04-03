import React from 'react';
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
    composeQueryString,
} from '../../utilities';
import './index.css';

class Home extends React.PureComponent {

    // TODO: Move this parsing into the action creator so it also has access to the unencoded text
    newTextSearch = () => {
        this.props.newSearch({
            q: this.props.searchBarValue,
        });
    }

    // If I want to make this reusable for resource page it's going to have to be able to accomodate
    // type/subtype combinations potentially TODO: verify this
    newFilterSearch = ({filterType, filter}) => () => {
        this.props.newSearch({ 
            [filterType]: filter,
        });
    }

    viewAllOnClick = () => {
        // TODO: This exact string needs to be figured out
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
                <h1>Resources for Researchers</h1>
                <a className="r4r__link--about" href="#i-am-a-dummyuurl">ABOUT RESOURCES FOR RESEARCHERS</a>
                <MultiLineText
                    text={ "I went out to a hazel wood because a fire was in my head. I cut and peeled a hazel wand and hooked a berry to a thread. And when white moths were on the wing, and moth-like stars were flickering out, I dropped the berry in a stream and caught a little, silver trout.\nWhen I had laid it on the floor, I went to blow the fire aflame. But something rustled on the floor and someone called me by my name. It had become a glimmering girl, with apple blossom in her hair, who called me by my name and ran and faded in the brightening air.\nThough I am old with wandering through hollow lands and hilly lands, I will find out where she has gone and kiss her lips and take her hands and walk among long dappled grass and pluck, til time and times are done, the silver apples of the moon, the golden apples of the sun." }
                />
                <div className='search'>
                    <h2>Search for resources and tools</h2>
                    <SearchBar
                        value={ this.props.searchBarValue }
                        onChange={ this.props.searchBarOnChange }
                        onSubmit={ this.newTextSearch }
                        page='home'
                    />
                </div>
                <h2>Find resources by tool type or research area</h2>

                <h3>Tool Type</h3>
                {
                    this.props.referenceFacets &&
                    <BrowseBox
                        facetFilters={ this.props.referenceFacets['toolTypes.type'].items }
                        filterType={ 'toolTypes.type' }
                        className='tool-types'
                        searchFunction={ this.newFilterSearch }
                    />
                }
                <h3>Research Area</h3>
                <div className='browse__container'>
                {
                    this.props.referenceFacets &&
                    <BrowseBox
                        facetFilters={ this.props.referenceFacets['researchAreas'].items }
                        filterType={ 'researchAreas'}
                        className='research-areas'
                        searchFunction={ this.newFilterSearch }
                    />
                }                
                </div>

                {/* 
                    This can execute a predefined search for any, first 20 results which can be built
                    as a simple a tag. This would be the first API call to prefetch I would guess.
                */}
                <div className='r4r__view-all'>
                    <h2 
                    onClick={ this.viewAllOnClick }
                    tabIndex="0"
                    >
                        View All Resources >
                    </h2>
                </div>
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
})

const mapDispatchToProps = {
    newSearch,
    loadFacets,
    searchBarOnChange: updateSearchBar,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));