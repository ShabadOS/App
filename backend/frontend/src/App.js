import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Reboot from 'material-ui/Reboot'

import Navigator from './components/Navigator'

import './App.css'

class App extends Component {
  constructor( props ) {
    super( props )

    this.state = {
      settings: null,
      session: null,
      theme: 'Night',
    }
  }

  render() {
    const { theme } = this.state

    return (
      <Router>
        <div className={`app theme-${theme.toLowerCase()}`}>
          <Reboot />
          <Route path="/navigator" component={Navigator} />
        </div>
      </Router>
    )
  }
}

export default App
