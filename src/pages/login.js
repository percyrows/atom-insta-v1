import React, {Component} from 'react'
import { toast } from 'react-toastify'
import firebase from 'firebase'
import store from '../tree'


class Login extends Component {

    constructor(props){
      super(props)
      this.state={
          loading: true,
      }
    }
  
    componentDidMount  = async ()=>{
      try{
        let data =await firebase.auth().getRedirectResult()
  
        if (data.credential){

          let user = firebase.database().ref(`users/${data.user.uid}`)

          let userFormat ={
            id: data.user.uid,
            displayName: data.user.displayName,
            photoURL: data.user.photoURL
          }


          user.set(userFormat)
          window.localStorage.setItem('user', JSON.stringify(userFormat))
          store.set ("user", userFormat)
          store.commit()

            let{
                history,
            } = this.props
        history.push('/home')
        }
        else{
            this.setState({
                loading: false
            })
            
        }
      }catch (error){
        this.setState({
          loading:false
        })
        toast.error(
          `Error: ${error.message}`,
          {
            position: toast.POSITION.TOP_RIGHT
          }
        )
        console.error(error)
      }
    }
    
    handleLoginWithSocialNetwork = async (service) =>{
      let stringService
      let provider
  
      if (service === 'facebook'){
        stringService='FacebookAuthProvider'
      }else if (service === 'google'){
        stringService='GoogleAuthProvider'
      }
      provider = new firebase.auth[stringService]()
      firebase.auth().signInWithRedirect(provider);
    }
    
    render() {

        let{
            loading
        } = this.state

        let content = <p className="cursive-font has-text-centered italic-font">loading...</p>
        if(!loading){
            content=(
                <div className="buttons">
                <button 
                onClick={()=> this.handleLoginWithSocialNetwork('facebook')}
                className="button is-info is-fullwidth">
                  Iniciar Sesion con Facebook
                </button>
                <button 
                onClick={()=> this.handleLoginWithSocialNetwork('google')}
                className="button is-Succes is-fullwidth">
                  Iniciar Sesion con Google
                </button>
                  </div>
            )
        }
      return ( <div className="columns">
          <div className="column is-8">
              <img 
              alt=""
              src="/insta-login.jpg"></img>
              </div>
         <div className="column">
         <h1 className="title is-1 has-text-centered italic-font main-title">
            Insta Atom
          </h1>
          {
              content
          }
        </div>
    </div>
      );
    }
  }
  
  export default Login;
  