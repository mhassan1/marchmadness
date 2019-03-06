import React, { Component } from 'react'
import { render } from 'react-dom'
import Cell from './Cell'

export default class Bracket extends Component {

  render() {
    const rows = []
    for (let i = 1; i <= 66; i++) {
      const cells = []
      for (let j = 1; j <= 11; j++) {
        const props = {fillable: this.props.fillable, setup: this.props.setup, ...this.props.bracket[j][i]}
        if (this.props.teams) props.teams = this.props.teams
        props.style = {
          ...(props.additionalStyle || {}),
          ...JSON.parse(props.format3 || '{}'),
          ...JSON.parse(props.style || '{}'),
        }
        cells.push(<Cell {...props} />)
      }
      rows.push(<tr key={i}>{cells}</tr>)
    }

    return (
      <table className="bracket"><tbody>
        {rows}
      </tbody></table>
    )
  }
}
