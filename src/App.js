import React, { Component } from 'react';
import firebase from 'firebase'
import 'bulma/css/bulma.css'
import './App.css';

import {
  BrowserRouter as Router, 
  Switch, 
  Route, 
} from 'react-router-dom'

import Login from './pages/login'
import Home from './pages/home'


  let firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "atom-insta-v1.firebaseapp.com",
    databaseURL: "https://atom-insta-v1.firebaseio.com",
    projectId: "atom-insta-v1",
    storageBucket: "atom-insta-v1.appspot.com",
    messagingSenderId: "88023080610",
    appId: "1:88023080610:web:c6b63361666438fb9ec1fb",
    measurementId: "G-5V2YR4NCSW"
  };
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

class App extends Component {

  constructor(props){
    super(props)
  }

  componentDidMount  = async ()=>{
    try{
      let data =await firebase.auth().getRedirectResult()

      if (data.credential){
        console.info('sesion iniciada')
      }
    }catch (error){
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
    return ( 
      <div className="container">
       <Router>
          <Switch>
            <Route
              path="/"
              exact
              component={Login}
            />
            <Route
              path="/home"
              component={Home} />
          </Switch>
      </Router>

      </div>)
  }
}

export default App;
