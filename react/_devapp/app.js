import React, { Component, Fragment } from 'react'
import { render } from 'react-dom'
import { asyncComponent } from 'react-async-component'
import Header from './Header'
import BracketFill from './BracketFill'
import BracketSetup from './BracketSetup'
import Dashboard from './Dashboard'
import myApp from 'myApp'

/* globals __webpack_public_path__ */
__webpack_public_path__ = `${window.STATIC_URL}/react/assets/bundle/`

class Myapp extends Component {
  constructor() {
    super()
    this.goto = this.goto.bind(this)
  }

  state = {
    view: null
  }

  goto(view) {
    this.setState({view})
  }

  render() {
    const { user, logged, submitted } = myApp

    const desiredView = (() => {
      if (this.state.view === null || this.state.view === 'home') {
        if (submitted) {
          return 'dashboard'
        } else {
          return 'bracket'
        }
      } else {
        return this.state.view
      }
    })()

    switch (desiredView) {
      case 'dashboard':
        return (
          <Fragment>
            <Header goto={this.goto} myApp={myApp}/>
            <Dashboard/>
          </Fragment>
        )
      case 'bracket':
        return (
          <Fragment>
            <Header goto={this.goto} myApp={myApp}/>
            <div className='container-fluid'>
              <BracketFill/>
            </div>
          </Fragment>
        )
      case 'setup':
        return (
          <Fragment>
            <Header goto={this.goto} myApp={myApp}/>
            <div className='container-fluid'>
              <BracketSetup/>
            </div>
          </Fragment>
        )
      case 'login':
        window.location.href = '/index.php/login'
      default:
        return null
    }
  }
}

render(<Myapp/>, document.getElementById('app'))
