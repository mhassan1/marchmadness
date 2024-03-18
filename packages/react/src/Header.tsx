import React, { Component } from 'react'
import { User } from 'marchmadness-types'

type Props = {
  user: User
  goto: (view: string) => void
  handleLogout: () => void
}

export default class Header extends Component<Props> {
  render() {
    const links = []
    if (this.props.user.username === 'admin') {
      links.push(
        <li className="nav-item">
          <a
            className="nav-link"
            href="#"
            onClick={() => this.props.goto('dashboard')}
          >
            Standings
          </a>
        </li>,
      )
      links.push(
        <li className="nav-item">
          <a
            className="nav-link"
            href="#"
            onClick={() => this.props.goto('bracket')}
          >
            Bracket
          </a>
        </li>,
      )
      links.push(
        <li className="nav-item">
          <a
            className="nav-link"
            href="#"
            onClick={() => this.props.goto('setup')}
          >
            Setup
          </a>
        </li>,
      )
    }
    return (
      <nav className="navbar navbar-custom navbar-fixed-top navbar-expand">
        <div className="container-fluid">
          <a
            className="navbar-brand"
            href="#"
            onClick={() => this.props.goto('home')}
          >
            March Madness
          </a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav">{links}</ul>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <span className="nav-link disabled" style={{ color: 'black' }}>
                  Welcome,{' '}
                  {this.props.user.username[0].toUpperCase() +
                    this.props.user.username.slice(1)}
                  !
                </span>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onClick={() => this.props.handleLogout()}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
          <div id="ballWrapper1" style={{ zIndex: 99 }}>
            <div id="ball1">
              <span id="ballshad1"></span>
            </div>
            <div id="ballShadow1"></div>
          </div>
          <div id="ballWrapper2" style={{ zIndex: 99 }}>
            <div id="ball2">
              <span id="ballshad2"></span>
            </div>
            <div id="ballShadow2"></div>
          </div>
        </div>
      </nav>
    )
  }
}
