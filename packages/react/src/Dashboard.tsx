import React, { Component, MouseEventHandler } from 'react'
import Standings from './Standings'
import Bracket from './Bracket'
import axios from 'axios'
import {
  Standings as StandingsType,
  Bracket as BracketType,
} from 'marchmadness-types'

export default class Dashboard extends Component {
  constructor() {
    super({})
    this.onSelectUser = this.onSelectUser.bind(this)
  }

  state: {
    standings: null | {
      standings: StandingsType
      brackets: Record<string, BracketType>
    }
    selectedUser: string
  } = {
    standings: null,
    selectedUser: 'admin',
  }
  _asyncRequest?: null | (Promise<void> & { cancel?: () => void })

  componentDidMount() {
    this._asyncRequest = axios
      .get(window.API_URL + '/dashboard')
      .then(({ data: standings }) => {
        this._asyncRequest = null
        this.setState({ standings })
      })
  }

  componentWillUnmount() {
    if (this._asyncRequest?.cancel) {
      this._asyncRequest.cancel()
    }
  }

  onSelectUser(event: Event) {
    if (!(event.target instanceof HTMLElement)) return
    event.preventDefault()
    this.setState({
      selectedUser: event.target.closest('tr')?.getAttribute('data-username'),
    })
  }

  render() {
    if (!this.state.standings) {
      return <div>Loading...</div>
    } else {
      return (
        <div className="container-fluid">
          <div className="pb-2 mt-4 mb-2 border-bottom">Standings</div>
          <div className="row">
            <div className="col-md-3">
              <p>
                Check out the standings! 'Curr.' is the number of points so far,
                'Poss.' is the number of possible points if all the remaining
                picks are correct, and 'Pred.' is the predicted likelihood of
                winning (only available after the Elite 8)!
              </p>

              <p>
                Correct Round 1 picks are worth 80 points, Round 2 picks are
                worth 160 points, Sweet 16 picks are worth 320 points, etc.
              </p>

              <p>
                Click on a user below to see their picks, or click on "Correct"
                to see the winning picks, so far. Correct picks are
                automatically updated every 15 mins.
                {/*<br />*/}
                {/*(Last Update:{' '}*/}
                {/*{new Date(this.state.standings.lastupdate).toLocaleString()})*/}
              </p>
              <Standings
                selectedUser={this.state.selectedUser}
                standings={this.state.standings.standings}
                onSelectUser={this.onSelectUser as unknown as MouseEventHandler}
              />
            </div>
            <div className="col-md-9">
              <Bracket
                bracket={this.state.standings.brackets[this.state.selectedUser]}
              />
            </div>
          </div>
        </div>
      )
    }
  }
}
