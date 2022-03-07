import React, { Component, FormEventHandler } from 'react'
import axios from 'axios'
import { onFailure } from './alerts'
import { User } from 'marchmadness-types'

type Props = {
  handleLogin: (user: User) => void
}

export default class Login extends Component<Props> {
  handleSubmit(event: Event) {
    if (!(event.target instanceof HTMLFormElement)) return
    event.preventDefault()
    const {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      username: { value: username },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      password: { value: password },
    } = this.refs
    axios
      .post(`${window.API_URL}/login`, {
        username,
        password,
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
        <form
          onSubmit={this.handleSubmit.bind(this) as unknown as FormEventHandler}
        >
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
