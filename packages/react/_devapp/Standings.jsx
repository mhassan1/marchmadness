import React, { Component, Fragment } from 'react'
import { render } from 'react-dom'
import axios from 'axios'

export default class Standings extends Component {
  render() {
    return (
      <table className="table" style={{ fontSize: '100%' }}>
        <thead>
          <tr>
            <th>User</th>
            <th>Curr.</th>
            <th>Poss.</th>
            <th>Pred.</th>
            <th>Pick</th>
          </tr>
        </thead>
        <tbody>
          {this.props.standings.map((standing) => {
            return (
              <tr
                className="standings_rows"
                id="row-{standing.username}"
                data-username={standing.username}
                onClick={this.props.onSelectUser}
                style={{
                  cursor: 'pointer',
                  backgroundColor:
                    standing.username === this.props.selectedUser
                      ? 'lightgrey'
                      : '',
                }}
              >
                <td>
                  {standing.username === 'admin'
                    ? 'Correct'
                    : standing.username[0].toUpperCase() +
                      standing.username.slice(1)}
                </td>
                <td>{standing.points}</td>
                <td>{standing.potential}</td>
                <td>
                  {standing.username !== 'admin'
                    ? 'winFrequency' in standing
                      ? standing.winFrequency + '%'
                      : 'N/A'
                    : ''}
                </td>
                <td
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <span style={JSON.parse(standing.finalpickformat3 || '{}')}>
                    {standing.finalpick}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}
