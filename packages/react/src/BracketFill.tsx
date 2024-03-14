import React, { Component, ChangeEventHandler, FormEventHandler } from 'react'
import axios from 'axios'
import Bracket from './Bracket'
import { onSuccess, onFailure } from './alerts'
import { User, Bracket as BracketType } from 'marchmadness-types'
import Cell from './Cell'

type Props = {
  user: User
}

export default class BracketFill extends Component<Props> {
  constructor(props: Props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onSelectChange = this.onSelectChange.bind(this)
    this.submitButton = this.submitButton.bind(this)
    this.refresh = this.refresh.bind(this)
    this.refreshAll = this.refreshAll.bind(this)
  }

  state: {
    bracket: null | { bracket: BracketType }
  } = {
    bracket: null,
  }
  _asyncRequest?: null | (Promise<void> & { cancel?: () => void })
  bracket?: { bracket: BracketType }
  bracketByHier: Record<string, Cell> = {}
  submitClicked = false

  componentDidMount() {
    this._asyncRequest = axios
      .get(window.API_URL + '/bracket')
      .then(({ data: bracket }) => {
        this._asyncRequest = null
        this.bracket = bracket
        this.bracketByHier = {}
        for (let i = 1; i <= 66; i++) {
          for (let j = 1; j <= 11; j++) {
            this.bracketByHier[bracket.bracket[j][i].hier] =
              bracket.bracket[j][i]
          }
        }
        this.refreshAll()
        this.setState({ bracket: this.bracket })
      })
  }

  componentWillUnmount() {
    if (this._asyncRequest?.cancel) {
      this._asyncRequest.cancel()
    }
  }

  onSelectChange(event: Event) {
    if (!(event.target instanceof HTMLSelectElement)) return
    event.preventDefault()
    const cell = this.bracketByHier[event.target.id]
    cell.pick = Number(event.target.value)
    cell.team_name = event.target.selectedOptions[0].text
    let id = event.target.id
    while (id) {
      this.refresh(this.bracketByHier[id])
      id = id.replace(/\.?\d$/, '')
    }
    this.setState({ bracket: this.bracket })
  }

  refresh(cell: Cell) {
    cell.opts = [
      this.bracketByHier[cell.hier + '.1'],
      this.bracketByHier[cell.hier + '.2'],
    ]
      .filter(Boolean)
      .map((opt) => ({
        bracket_id: opt.pick || opt.bracket_id,
        team_name: opt.team_name,
      })) as Cell[]
    cell.onSelectChange = this
      .onSelectChange as unknown as ChangeEventHandler<HTMLSelectElement>
  }

  refreshAll() {
    for (let i = 1; i <= 66; i++) {
      for (let j = 1; j <= 11; j++) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.refresh(this.bracket?.bracket[j][i])
      }
    }
  }

  submitButton() {
    this.submitClicked = true
  }

  handleSubmit(event: Event) {
    if (!(event.target instanceof HTMLFormElement)) return
    event.preventDefault()
    const formData = new FormData(event.target)
    const data: Record<string, string | boolean> = {}
    formData.forEach((value, key) => {
      data[key] = value as string
    })
    if (this.submitClicked) {
      data.submit = true
      this.submitClicked = false

      // validate
      let isValid = true
      for (const cell of Object.values(this.bracketByHier)) {
        if (cell.fixed == 0 && !cell.team_name) {
          isValid = false
          cell.additionalStyle = { backgroundColor: 'red' }
        } else {
          cell.additionalStyle = { backgroundColor: '' }
        }
      }
      if (!isValid) {
        this.setState({ bracket: this.bracket })
        alert(
          'You are missing some picks (shown in red)! If you want to save your work and come back later, click Save.',
        )
        return
      }
    }

    axios
      .put(window.API_URL + '/bracket', data)
      .then(onSuccess, onFailure)
      .then(() => {
        if (data.submit) {
          window.location.reload()
        }
      })
  }

  render() {
    if (!this.state.bracket) {
      return <div>Loading...</div>
    } else {
      const buttons = []
      buttons.push(
        <input
          style={{ marginLeft: '200px' }}
          type="submit"
          name="save"
          value="Save"
        />,
      )
      if (this.props.user.username !== 'admin') {
        buttons.push(
          <input
            type="submit"
            name="submit"
            value="Submit"
            onClick={this.submitButton}
          />,
        )
      }
      return (
        <div className="container-fluid">
          <div className="pb-2 mt-4 mb-2 border-bottom">My Bracket</div>
          <p>
            Make your picks below! If you'd like to save your progress and
            continue later, click Save. When you are done, click Submit! Please
            submit your picks before the first game starts!
          </p>
          <form
            id="bracket"
            action="#"
            method="post"
            onSubmit={this.handleSubmit as unknown as FormEventHandler}
          >
            {buttons}
            <Bracket fillable={true} bracket={this.state.bracket.bracket} />
          </form>
        </div>
      )
    }
  }
}
