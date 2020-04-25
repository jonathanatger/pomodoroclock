import React from 'react';
import './App.css';

import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';


// Redux ----------------
const RUNSTATE = "runstate";
const runStates = {
  pause : "pause",
  work : "work",
  break : "break"
}

//to implement
const TIME = "time";
const WORKSETTING = "worksetting";
const BREAKSETTING = "breaksetting";

const initialState = {
  runState : runStates.pause
}

const runStateAction = (rs) => {
  return({
  type : RUNSTATE,
  runState : rs
  })
}

const reducer = (state = initialState, action) => {
  switch (action.type){
    case RUNSTATE :
      return {
        runState : action.runState
      }
    default : 
      return initialState;
  }
}

const store = createStore(reducer);



//React -----------------------------

function Settings() {
  return (
    <text id="break-label">break :</text>
  )
}

class App extends React.Component {
  render(){
    return(
      <div>
        <div className="header">
          <h1 className="main-title">Pomodoro Clock</h1>
          
        </div>
        <div className="app" >
          <Timer workState="Work" />
          <SettingsTab />          
        </div>
      </div>
    )
  }
}

class Timer extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div>
        <div className="timer work" >
          <p id="timer-label" className="timer-label">Session</p>
          <p id="time-left" className="timer-numbers"> 25 : 00</p>        
        </div>
        <div className="timer break" >
          <p id="timer-label-break" className="timer-label">Break</p>
          <p id="time-left-break" className="timer-numbers"> 25 : 00</p>        
        </div>
      </div>
    )
  }

}

class SettingsTab extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className="settings-tab" >
         <div className='custom-border'></div>
        <div className="timer-controls">
          <button id="start_stop" >Go/Stop</button>
          <button id="reset" >Reset</button>
        </div>
        <div className="settings flex-row">
          <h3 id="break-label">Break length</h3>
          <h3 id="break-increment">^</h3>
          <h3 id="break-length"> 5:00</h3>
          <h3 id="break-decrement">!</h3>          
        </div>
        <div className="settings flex-row">
          <h3 id="session-label">Session length</h3>
          <h3 id="session-increment">^</h3>
          <h3 id="session-length"> 25:00</h3>
          <h3 id="session-decrement">!</h3>           
        </div>
        <div className='custom-border'></div>
      </div>
    )
  }

}





//Wrapper for export ----------------------
function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
    
  );
}

export default AppWrapper;
