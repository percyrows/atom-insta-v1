import React, {Component} from 'react'
import Navbar from './navbar'
import { ToastContainer } from 'react-toastify'
import Login from '../pages/login'
import tree from '../tree'
import { database } from 'firebase'

class Layout extends Component {

    state={
        user: tree.get('user')
    }

    stateLoggedChange = (data = null) =>{
        this.setState({
            user : data
        })

    }

    render(){
        
        let{
            user
        } = this.state

        let userLogged = tree.get('user')
        let {
            children
        } = this.props
        
        return(
            <div>
                <ToastContainer/>
                <Navbar
                usesLogged={!!user}
                callback={this.stateLoggedChange}
                />
                <div className="container">
                    <div className="section">
                    {
                    user ? children : <Login callback={this.stateLoggedChange} />
                    }
                    </div>
                </div>
            </div>
        )
    }
}

export default Layout