import React, { Component, Fragment } from 'react'
import { render, componentDidMount, componentWillUnmount } from 'react-dom'
import Bracket from './Bracket'
import axios from 'axios'
import { onSuccess, onFailure } from './alerts'

export default class BracketSetup extends Component {
  constructor() {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  state = {
    setup: null,
  }

  componentDidMount() {
    this._asyncRequest = axios.get(__API_HOST__ + 'setup').then(
      ({data: setup}) => {
        this._asyncRequest = null
        this.setState({setup})
      }
    )
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel()
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.target)
    axios.post(__API_HOST__ + 'setup/submit', data).then(onSuccess, onFailure)
  }

  render() {
    if (!this.state.setup) {
      return (
        <div>Loading...</div>
      )
    } else {
      return (
        <div className='container-fluid'>
          <div className='pb-2 mt-4 mb-2 border-bottom'>Bracket Setup</div>
          <p>This page should be used for initial setup of brackets. Click Save when finished. Choose "Round0-#n" at the bottom of the list for the 4 Round 0 games.
          Once the users are saving picks, don't change anything here. There isn't validation on this page, so be careful!</p>
          <form id="bracket" action="#" method="post" onSubmit={this.handleSubmit}>
            <input style={{marginLeft:'200px'}} type="submit" name="save" value="Save"/>
            <Bracket setup={true} teams={this.state.setup.teams} bracket={this.state.setup.bracket} />
          </form>
        </div>
      )
    }
  }
}
