import React, { Component, useReducer } from 'react'
import { Link } from 'react-router-dom'
import firebase from 'firebase'
import tree from '../tree'
import {withRouter} from 'react-router-dom'


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

  handleLogout = () =>{
    firebase.auth().signOut()
    .then(()=>{
      tree.set('user', null)
      tree.commit()
      window.localStorage.clear()
      this.props.callback()
      this.props.history.push('/')
    })
    .catch((error) =>{
      console.log(error)
    })
  }

  render () {
    
    let{
      userLogged
    }= this.props

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


        <div className="navbar-sart" />

        <div className="navbar-end">

          {
            userLogged && <div className="navbar-item">
            <button className="button is-primary is-inverted is-outlined" onClick={this.handleLogout}>
              Salir  
            </button>

          </div>

          }

        </div>
      </div>
    </nav>)
  }
}

export default withRouter (Navbar)