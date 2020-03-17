import React, { Component } from 'react'
import { render } from 'react-dom'
import axios from 'axios'
import { onFailure } from './alerts'

export default class Login extends Component {
  handleSubmit(event) {
    event.preventDefault()
    axios.post(`${API_URL}/login`, {
      username: this.refs.username.value,
      password: this.refs.password.value
    }).then(({ data: user }) => {
      this.props.handleLogin(user)
    }).catch(onFailure)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input name="username" ref="username"/>
        <input name="password" type="password" ref="password"/>
        <input type="submit" value="Log In"/>
      </form>
    )
  }
}
