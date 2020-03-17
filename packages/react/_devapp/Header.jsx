import React, { Component, Fragment } from 'react'
import { render } from 'react-dom'

export default class Header extends Component {
  render() {
    const links = []
    if (this.props.user.username === 'admin') {
      links.push(<li className='nav-item'><a className='nav-link' href="#" onClick={() => this.props.goto('dashboard')}>Standings</a></li>)
      links.push(<li className='nav-item'><a className='nav-link' href="#" onClick={() => this.props.goto('bracket')}>Bracket</a></li>)
      links.push(<li className='nav-item'><a className='nav-link' href="#" onClick={() => this.props.goto('setup')}>Setup</a></li>)
    }
    return (
      <nav className="navbar navbar-custom navbar-fixed-top navbar-expand">
        <a className="navbar-brand" href="#" onClick={() => this.props.goto('home')}>March Madness</a>
        <div className='collapse navbar-collapse'>
          <ul className="navbar-nav">
            {links}
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className='nav-item'><span className='nav-link'>Welcome, {this.props.user.username}!</span></li>
            <li className='nav-item'><a className='nav-link' href="#" onClick={() => this.props.handleLogout()}>Logout</a></li>
          </ul>
        </div>
        <div id="ballWrapper" style={{zIndex: 99}}>
          <div id="ball"><span id="ballshad"></span></div>
          <div id="ballShadow"></div>
        </div>
      </nav>
    )
  }
}
