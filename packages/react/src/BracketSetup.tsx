import React, { Component, FormEventHandler } from 'react'
import Bracket from './Bracket'
import axios from 'axios'
import { onSuccess, onFailure } from './alerts'
import { Rows, Bracket as BracketType } from 'marchmadness-types'

export default class BracketSetup extends Component {
  constructor() {
    super({})
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  state: {
    setup: null | {
      bracket: BracketType
      teams?: Rows
    }
  } = {
    setup: null,
  }
  _asyncRequest?: null | (Promise<void> & { cancel?: () => void })

  componentDidMount() {
    this._asyncRequest = axios
      .get(window.API_URL + '/setup')
      .then(({ data: setup }) => {
        this._asyncRequest = null
        this.setState({ setup })
      })
  }

  componentWillUnmount() {
    if (this._asyncRequest?.cancel) {
      this._asyncRequest.cancel()
    }
  }

  handleSubmit(event: Event) {
    if (!(event.target instanceof HTMLFormElement)) return
    event.preventDefault()
    const formData = new FormData(event.target)
    const data: Record<string, string | boolean> = {}
    formData.forEach((value, key) => {
      data[key] = value as string
    })
    axios.post(window.API_URL + '/setup', data).then(onSuccess, onFailure)
  }

  render() {
    if (!this.state.setup) {
      return <div>Loading...</div>
    } else {
      return (
        <div className="container-fluid">
          <div className="pb-2 mt-4 mb-2 border-bottom">Bracket Setup</div>
          <p>
            This page should be used for initial setup of brackets. Click Save
            when finished. Choose "Round0-#n" at the bottom of the list for the
            4 Round 0 games. Once the users are saving picks, don't change
            anything here. There isn't validation on this page, so be careful!
          </p>
          <form
            id="bracket"
            action="#"
            method="post"
            onSubmit={this.handleSubmit as unknown as FormEventHandler}
          >
            <input
              style={{ marginLeft: '200px' }}
              type="submit"
              name="save"
              value="Save"
            />
            <Bracket
              setup={true}
              teams={this.state.setup.teams}
              bracket={this.state.setup.bracket}
            />
          </form>
        </div>
      )
    }
  }
}
