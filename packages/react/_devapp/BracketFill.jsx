import React, { Component, Fragment } from 'react'
import { render, componentDidMount, componentWillUnmount } from 'react-dom'
import Bracket from './Bracket'
import axios from 'axios'
import { onSuccess, onFailure } from './alerts'

export default class BracketFill extends Component {
  constructor() {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onSelectChange = this.onSelectChange.bind(this)
    this.submitButton = this.submitButton.bind(this)
    this.refresh = this.refresh.bind(this)
    this.refreshAll = this.refreshAll.bind(this)
  }

  state = {
    bracket: null,
  }

  componentDidMount() {
    this._asyncRequest = axios.get(API_URL + '/bracket').then(
      ({data: bracket}) => {
        this._asyncRequest = null
        this.bracket = bracket
        this.bracketByHier = {}
        for (let i = 1; i <= 66; i++) {
          for (let j = 1; j <= 11; j++) {
            this.bracketByHier[this.bracket.bracket[j][i].hier] = this.bracket.bracket[j][i]
          }
        }
        this.refreshAll()
        this.setState({bracket: this.bracket})
      }
    )
  }

  componentWillUnmount() {
    if (this._asyncRequest?.cancel) {
      this._asyncRequest.cancel()
    }
  }

  onSelectChange(event) {
    event.preventDefault()
    const cell = this.bracketByHier[event.target.id]
    cell.pick = event.target.value
    cell.team_name = event.target.selectedOptions[0].text
    let id = event.target.id
    while (id) {
      this.refresh(this.bracketByHier[id])
      id = id.replace(/\.?\d$/, '')
    }
    this.setState({bracket: this.bracket})
  }

  refresh(cell) {
    cell.opts = [
      this.bracketByHier[cell.hier + '.1'],
      this.bracketByHier[cell.hier + '.2']
    ]
      .filter(Boolean)
      .map((opt) => ({bracket_id: opt.pick || opt.bracket_id, team_name: opt.team_name}))
    cell.onSelectChange = this.onSelectChange
  }

  refreshAll() {
    for (let i = 1; i <= 66; i++) {
      for (let j = 1; j <= 11; j++) {
        this.refresh(this.bracket.bracket[j][i])
      }
    }
  }

  submitButton() {
    this.submitClicked = true
  }

  handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const data = {}
    formData.forEach((value, key) => {
      data[key] = value
    })
    if (this.submitClicked) {
      data.submit = true
      this.submitClicked = false

      // validate
      let isValid = true
      for (const cell of Object.values(this.bracketByHier)) {
        if (cell.fixed == 0 && !cell.team_name) {
          isValid = false
          cell.additionalStyle = {backgroundColor: 'red'}
        } else {
          cell.additionalStyle = {backgroundColor: ''}
        }
      }
      if (!isValid) {
        this.setState({bracket: this.bracket})
        alert('You are missing some picks (shown in red)! If you want to save your work and come back later, click Save.')
        return
      }
    }

    axios.put(API_URL + '/bracket', data)
      .then(onSuccess, onFailure)
      .then(() => {
        if (data.submit) {
          window.location.reload()
        }
      })
  }

  render() {
    if (!this.state.bracket) {
      return (
        <div>Loading...</div>
      )
    } else {
      const buttons = []
      buttons.push(<input style={{marginLeft:'200px'}} type="submit" name="save" value="Save"/>)
      if (this.props.user.username !== 'admin') {
        buttons.push(<input type="submit" name="submit" value="Submit" onClick={this.submitButton}/>)
      }
      return (
        <div className='container-fluid'>
          <div className='pb-2 mt-4 mb-2 border-bottom'>My Bracket</div>
          <p>Make your picks below! If you'd like to save your progress and continue later, click Save. When you are done, click Submit! Please submit your picks before the first game starts!</p>
          <form id="bracket" action="#" method="post" onSubmit={this.handleSubmit}>
            {buttons}
            <Bracket fillable={true} bracket={this.state.bracket.bracket} />
          </form>
        </div>
      )
    }
  }
}
