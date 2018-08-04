import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import { Toolbar, Typography } from 'material-ui'
import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
  faBars,
  faBookOpen,
  faHistory,
  faList,
  faSearch,
  faSignOutAlt,
  faWindowMinimize,
} from '@fortawesome/fontawesome-free-solid'
import { faSquare } from '@fortawesome/fontawesome-free-regular'

import controller from '../../lib/controller'
import {
  BANIS_URL,
  CONTROLLER_URL,
  HISTORY_URL,
  MENU_URL,
  NAVIGATOR_URL,
  SEARCH_URL,
} from '../../lib/consts'

import ToolbarButton from './ToolbarButton'
import Search from './Search'
import Menu from './Menu'
import Navigator, { Bar as NavigatorBar } from './Navigator'
import History from './History'

import './index.css'

/**
 * Renders the top navigation bar, showing the current path in the URL, and the hover state.
 * @param title The title text in the top bar.
 * @param history A `history` object.
 * @param location A `location` object.
 * @param onHover Fired on hover with name.
 */
const TopBar = ( { title, history, location, onHover } ) => {
  const resetHover = () => onHover( null )

  return (
    <Toolbar className="top bar">
      <ToolbarButton
        name="Menu"
        icon={faBars}
        onClick={() => history.push( { ...location, pathname: MENU_URL } )}
        onMouseEnter={() => onHover( 'Menu' )}
        onMouseLeave={resetHover}
      />
      <ToolbarButton
        name="Backwards"
        icon={faArrowAltCircleLeft}
        onClick={() => history.goBack()}
        onMouseEnter={() => onHover( 'Backwards' )}
        onMouseLeave={resetHover}
      />
      <ToolbarButton
        name="Forwards"
        icon={faArrowAltCircleRight}
        onClick={() => history.goForward()}
        onMouseEnter={() => onHover( 'Forwards' )}
        onMouseLeave={resetHover}
      />
      <Typography className="name" type="title">{title}</Typography>
      <ToolbarButton
        name="Minimize"
        icon={faWindowMinimize}
        onClick={() => history.push( '/' )}
        onMouseEnter={() => onHover( 'Minimize' )}
        onMouseLeave={resetHover}
      />
      <ToolbarButton
        name="Pop Out"
        icon={faSignOutAlt}
        onClick={() => window.open( `${CONTROLLER_URL}/?controllerOnly=true`, '_blank' )}
        onMouseEnter={() => onHover( 'Pop Out' )}
        onMouseLeave={resetHover}
      />
    </Toolbar>
  )
}

/**
 * Renders the bottom navigation bar.
 * @param history A `history` object.
 * @param renderContent A render prop for content in the bottom bar.
 * @param location A `location` object.
 * @param onHover Fired on hover with name.
 */
const BottomBar = ( { history, renderContent, location, onHover } ) => {
  const go = pathname => () => history.push( { ...location, pathname } )
  const resetHover = () => onHover( null )

  return (
    <Toolbar className="bottom bar">
      <ToolbarButton name="Search" icon={faSearch} onClick={go( SEARCH_URL )} onHover={onHover} />
      <ToolbarButton
        name="Banis"
        icon={faBookOpen}
        onClick={go( BANIS_URL )}
        onMouseEnter={() => onHover( 'Search' )}
        onMouseLeave={resetHover}
      />
      <ToolbarButton
        name="History"
        icon={faHistory}
        onClick={go( HISTORY_URL )}
        onMouseEnter={() => onHover( 'History' )}
        onMouseLeave={resetHover}
      />
      <div className="name">{renderContent()}</div>
      <ToolbarButton
        name="Navigator"
        icon={faList}
        onClick={go( NAVIGATOR_URL )}
        onMouseEnter={() => onHover( 'Navigator' )}
        onMouseLeave={resetHover}
      />
      <ToolbarButton
        name="Clear"
        icon={faSquare}
        onClick={controller.clear}
        onMouseEnter={() => onHover( 'Clear' )}
        onMouseLeave={resetHover}
      />
    </Toolbar>
  )
}


/**
 * Controller controls the display and configures settings.
 */
class Controller extends Component {
  constructor( props ) {
    super( props )

    this.state = {
      hovered: null,
    }
  }

  componentDidUpdate( { shabad: prevShabad } ) {
    const { history, shabad, location } = this.props
    const { pathname } = location

    const redirects = [ SEARCH_URL, HISTORY_URL ]
    // Go to navigator if a different Shabad has been selected, and we're on the search/history page
    if ( shabad !== prevShabad && redirects.some( route => pathname.includes( route ) ) ) {
      history.push( { ...location, pathname: NAVIGATOR_URL } )
    }
  }

  onHover = hovered => this.setState( { hovered } )

  render() {
    const { location } = this.props
    const { hovered } = this.state

    const routes = [
      [ MENU_URL, Menu ],
      [ SEARCH_URL, Search ],
      [ NAVIGATOR_URL, Navigator, NavigatorBar ],
      [ HISTORY_URL, History ],
    ]

    return (
      <Switch>
        {routes.map( ( [ route, Component, BarComponent ] ) => (
          <Route
            key={route}
            path={route}
            render={props => (
              <div className="controller">
                <TopBar
                  {...props}
                  title={hovered || route.split( '/' ).pop()}
                  onHover={this.onHover}
                />
                <div className="content">
                  <Component {...this.props} {...props} />
                </div>
                <BottomBar
                  {...props}
                  onHover={this.onHover}
                  renderContent={() => BarComponent && <BarComponent {...this.props} {...props} />}
                />
              </div>
            )}
          />
        ) )}
        <Redirect to={{ ...location, pathname: SEARCH_URL }} />
      </Switch>
    )
  }
}

export default Controller
