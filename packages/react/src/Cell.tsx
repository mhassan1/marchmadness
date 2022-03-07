import { Rows } from 'marchmadness-types'
import React, { ChangeEventHandler, Component, CSSProperties } from 'react'

type Props = Omit<Rows[number], 'style'> & {
  onSelectChange?: ChangeEventHandler<HTMLSelectElement>
  fillable?: boolean
  style: CSSProperties
  setup?: boolean
  opts?: Cell[]
}

export default class Cell extends Component<Props> {
  opts?: Props['opts']
  onSelectChange?: Props['onSelectChange']
  pick: Props['pick']
  team_name: Props['team_name']
  bracket_id?: Props['bracket_id']
  hier?: Props['hier']
  fixed?: Props['fixed']
  additionalStyle?: Props['additionalStyle']

  render() {
    if (this.props.fixed !== null && this.props.fixed !== '') {
      if (this.props.fixed == 0 && this.props.fillable) {
        return (
          <td style={{ borderBottom: '1px solid black', ...this.props.style }}>
            <select
              id={this.props.hier}
              name={String(this.props.bracket_id)}
              onChange={this.props.onSelectChange}
              value={this.props.pick || this.props.bracket_id}
            >
              <option
                id={this.props.hier + '-1'}
                value={this.props.bracket_id}
              ></option>
              <option
                id={this.props.hier + '-2'}
                value={this.props.opts?.[0].bracket_id}
              >
                {this.props.opts?.[0].team_name}
              </option>
              <option
                id={this.props.hier + '-3'}
                value={this.props.opts?.[1].bracket_id}
              >
                {this.props.opts?.[1].team_name}
              </option>
            </select>
          </td>
        )
      } else if (
        (this.props.fixed == 1 || Number(this.props.team_id) < 0) &&
        this.props.setup
      ) {
        const options = []
        for (const team of this.props.teams || []) {
          options.push(
            <option
              id={String(team.team_id)}
              value={team.team_id}
              selected={team.team_id == this.props.team_id}
            >
              {team.team_name}
            </option>
          )
        }
        options.push(
          <option id="round0-1" value="-1" selected={this.props.team_id == -1}>
            Round 0 - #1
          </option>
        )
        options.push(
          <option id="round0-1" value="-2" selected={this.props.team_id == -2}>
            Round 0 - #2
          </option>
        )
        options.push(
          <option id="round0-1" value="-4" selected={this.props.team_id == -4}>
            Round 0 - #3
          </option>
        ) // 4 then 3 because of out->in ordering on both sides of bracket
        options.push(
          <option id="round0-1" value="-3" selected={this.props.team_id == -3}>
            Round 0 - #4
          </option>
        )

        return (
          <td style={{ borderBottom: '1px solid black' }}>
            <select
              id={this.props.hier}
              name={
                this.props.bracket_id +
                ',' +
                this.props.hier +
                ',' +
                this.props.seed
              }
            >
              <option id="none" value=""></option>
              {options}
            </select>
          </td>
        )
      } else {
        return (
          <td style={{ borderBottom: '1px solid black', ...this.props.style }}>
            <span>{this.props.team_name}</span>
            <select id={this.props.hier} style={{ display: 'none' }} disabled>
              <option id={this.props.hier + '-1'} value={this.props.bracket_id}>
                {this.props.team_name}
              </option>
            </select>
          </td>
        )
      }
    } else {
      return <td style={this.props.style}>{this.props.team_name}</td>
    }
  }
}
