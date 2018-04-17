import React from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Theme } from '../theme';

class MobileMenu extends React.PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        closeMenu: PropTypes.func.isRequired,
    }

    render(){
        return(
            <ReactCSSTransitionGroup
                transitionName="slide"
                transitionEnterTimeout={300}
                transitionLeaveTimeout={300}
            >
            {
                this.props.isOpen
                ?
                    <section>
                        <Theme
                            element="div"
                            className={`results__mobile-nav ${ this.props.isOpen ? 'r4r-active' : '' }`}
                        >
                            <Theme
                                element="button"
                                autoFocus
                                className="results__button--done"
                                onClick={ this.props.closeMenu }
                            >
                                <p>DONE</p>
                            </Theme>
                            { this.props.children }
                        </Theme>
                        <Theme
                            element="div"
                            className={`results__mobile-overlay ${ this.props.isOpen ? 'r4r-active' : '' }`}
                            onClick={ this.props.closeMenu }
                        />
                    </section>
                :
                    null
            }
            </ReactCSSTransitionGroup>            
        )
    }
}

export default MobileMenu;