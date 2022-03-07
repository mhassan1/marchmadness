import React, { Component, Fragment } from 'react'
import { render } from 'react-dom'
import { User } from 'marchmadness-types'
import './css/app.scss'
import axios from 'axios'
import Header from './Header'
import BracketFill from './BracketFill'
import BracketSetup from './BracketSetup'
import Dashboard from './Dashboard'
import Login from './Login'

declare global {
  interface Window {
    STATIC_URL: string
    API_URL: string
  }
  let __webpack_public_path__: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
__webpack_public_path__ = `${window.STATIC_URL}/react/build/`

axios.defaults.withCredentials = true

class Myapp extends Component {
  constructor() {
    super({})
    this.goto = this.goto.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  state: {
    view: null | string
    user: null | User
    userInfoReceived: boolean
  } = {
    view: null,
    user: null,
    userInfoReceived: false,
  }

  goto(view: string) {
    this.setState({ view })
  }

  handleLogin(user: User) {
    this.setState({ user })
  }

  handleLogout() {
    axios.post(window.API_URL + '/logout').then(() => {
      this.setState({ user: null })
    })
  }

  componentWillMount() {
    axios.get(window.API_URL + '/me').then((resp) => {
      this.setState({ user: resp.data, userInfoReceived: true })
    })
  }

  render() {
    if (!this.state.userInfoReceived) return null

    const desiredView = (() => {
      if (!this.state.user) {
        return 'login'
      }
      if (this.state.view === null || this.state.view === 'home') {
        return this.state.user.submitted ? 'dashboard' : 'bracket'
      }
      return this.state.view
    })()

    switch (desiredView) {
      case 'dashboard':
        return (
          <Fragment>
            <Header
              goto={this.goto}
              user={this.state.user as User}
              handleLogout={this.handleLogout}
            />
            <Dashboard />
          </Fragment>
        )
      case 'bracket':
        return (
          <Fragment>
            <Header
              goto={this.goto}
              user={this.state.user as User}
              handleLogout={this.handleLogout}
            />
            <div className="container-fluid">
              <BracketFill user={this.state.user as User} />
            </div>
          </Fragment>
        )
      case 'setup':
        return (
          <Fragment>
            <Header
              goto={this.goto}
              user={this.state.user as User}
              handleLogout={this.handleLogout}
            />
            <div className="container-fluid">
              <BracketSetup />
            </div>
          </Fragment>
        )
      case 'login':
        return <Login handleLogin={this.handleLogin} />
      default:
        return null
    }
  }
}

render(<Myapp />, document.getElementById('app'))
