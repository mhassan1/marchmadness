import React, { Component } from 'react'
import { render } from 'react-dom'
import axios from 'axios'
import { onFailure } from './alerts'

export default class Login extends Component {
  handleSubmit(event) {
    event.preventDefault()
    axios
      .post(`${API_URL}/login`, {
        username: this.refs.username.value,
        password: this.refs.password.value,
      })
      .then(({ data: user }) => {
        this.props.handleLogin(user)
      })
      .catch(onFailure)
  }

  render() {
    return (
      <div style={{ margin: '10% auto' }} className="col-md-3">
        <h1>March Madness</h1>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <table className="login">
            <tr>
              <td>Username</td>
              <td>
                <input name="username" ref="username" />
              </td>
            </tr>
            <tr>
              <td>Password</td>
              <td>
                <input name="password" type="password" ref="password" />
              </td>
            </tr>
            <tr>
              <td>
                <input type="submit" value="Log In" />
              </td>
            </tr>
          </table>
        </form>
      </div>
    )
  }
}
