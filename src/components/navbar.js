import React, { Component } from 'react'
import { Link } from 'react-router-dom'


class Navbar extends Component {
  state = {
    collapsed: false
  }

  handleMenu = () => {
    this.setState((prevState) => {
      return {
        collapsed: !prevState.collapsed
      }
    })
  }

  render () {

    let {
      collapsed
    } = this.state

    return (<nav className="navbar is-black" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/home">
          <p className="italic-font">
          Insta Atom
          </p>
        </Link>

        <a role="button"
          onClick={this.handleMenu}
          className="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample"
        className={`navbar-menu ${collapsed ? 'is-active' : ''}`}>
        <div className="navbar-end">
          <div className="navbar-item">
          </div>
        </div>
      </div>
    </nav>)
  }
}

export default Navbar