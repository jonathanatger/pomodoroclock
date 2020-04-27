import React from 'react';
import './App.css';

import {createStore, combineReducers} from 'redux';
import {Provider, connect} from 'react-redux';


// Redux ----------------
const RUNSTATE = "runstate";
const runStates = {
  pause : "pause",
  work : "work",
  break : "break"
}

//to implement
const SETTINGS = "settings";

/*
const initialState = {
  runState : runStates.pause,
  settings : {
    workSetting : "25",
    breakSetting : "5"
  }
}
*/

const runStateAction = (actiontype, rs) => {
  return({
  type : actiontype,
  runState : rs,
  })
}

const runStateReducer = (state =  runStates.work, action) => {
  switch (action.type){
    case RUNSTATE :
      return action.runState;
    default : 
      return state;
  }
}

const settingsReducer = (state = {workSetting : "01", breakSetting : "01"}, action) => {
  switch (action.type){
    case SETTINGS :
      return {workSetting : action.workSetting, breakSetting : action.breakSetting };
    default :
      return state;
  }
}

const rootReducer = combineReducers({
  runState : runStateReducer,
  settings : settingsReducer
})

const store = createStore(rootReducer);



//React -----------------------------

function Settings() {
  return (
    <text id="break-label">break :</text>
  )
}

class App extends React.Component {
  constructor(props){
    super(props);
    
  }

  render(){
    return(
      <div>
        <div className="header">
          <h1 className="main-title">Pomodoro Clock</h1>
          
        </div>
        <div className="app" >
          <ConnectedTimer />
          <SettingsTab />     
        </div>
      </div>
    )
  }
}


class Timer extends React.Component{
  constructor(props){
    super(props);
    this.controlInterval = this.controlInterval.bind(this);
    this.updateComponentTime = this.updateComponentTime.bind(this);
    this.rotateComponent = this.rotateComponent.bind(this);
    this.state = {
      workMin : store.getState()["settings"].workSetting,
      workSec : "00",
      breakMin : store.getState()["settings"].breakSetting,
      breakSec : "00"
    }
  }

 
  

  render(){
      return(
      <div>
        <div className="timer work" id="timer-work">
          <p id="timer-label" className="timer-label">Session</p>
          <p id="time-left" className="timer-numbers">{this.state.workMin + ":" + this.state.workSec}</p>        
        </div>
        <div className="timer break" id="timer-break">
          <p id="timer-label-break" className="timer-label">Break</p>
          <p id="time-left-break" className="timer-numbers">{this.state.breakMin + ":" + this.state.breakSec}</p>        
        </div>
      </div>
    )
  }
  
  controlInterval(){
  if((this.state.workMin == "00" && this.state.workSec == "00")||(this.state.breakMin == "00" && this.state.breakSec == "00")){
    this.props.switchRunState(this.props.workState);
    clearInterval(this.timerInterval)
        
    this.setState( () => ({
        workMin : store.getState().settings.workSetting,
        workSec : "00" ,
        breakMin : store.getState().settings.breakSetting,
        breakSec :"00" 
          })
        )    
        this.updateComponentTime();
        this.rotateComponent("timer-work");  
        this.rotateComponent("timer-break"); 
    }
  }

  rotateComponent(id){
    let elemClasslist = document.getElementById(id).classList
    console.log(elemClasslist)
    if(elemClasslist.contains("spin-to-bottom")){
      elemClasslist.remove("spin-to-bottom");
      elemClasslist.add("spin-to-top");
    }else if(elemClasslist.contains("spin-to-top")){
      elemClasslist.remove("spin-to-top");
      elemClasslist.add("spin-to-bottom");
    }else{
      elemClasslist.add("spin-to-bottom");
    }
    ;    
  }

  updateTimer = function(mins, secs){
    let _newMins = mins;
    let _newSecs = secs;

    if(mins=="00" && secs=="00"){
      _newMins = "00"
      _newSecs = "00";
    }else if(secs == "00"){
      _newMins = _newMins -1;
      _newMins = _newMins.toString();
      if (_newMins.length == 1){
        _newMins = "0" + _newMins
      }    
      _newSecs = "59"
    } else {
      _newSecs = _newSecs - 1;
      _newSecs = _newSecs.toString();
      if (_newSecs.length == 1){
        _newSecs = "0" + _newSecs
      }    
    }

    return {mins : _newMins.toString(), secs : _newSecs.toString()}    
  }

  updateComponentTime(){
    if (this.props.workState == runStates.work && (this.state.workMin != "00" || this.state.workSec != "00")){
      this.timerInterval = setInterval( () => {
        const newwTime = this.updateTimer(this.state.workMin, this.state.workSec);
        
        this.setState( prevState => ({
          workMin : newwTime.mins,
          workSec : newwTime.secs ,
          breakMin : prevState.breakMin,
          breakSec : prevState.breakSec  
            })
          )
        this.controlInterval();
        
        }      
          , 50)
         
      } 
    else if (this.props.workState == runStates.break && (this.state.breakMin != "00" || this.state.breakSec != "00")){
        this.timerInterval = setInterval( () => {
          const newbTime = this.updateTimer(this.state.breakMin, this.state.breakSec);          
          this.setState( prevState => ({
            workMin : prevState.workMin,
            workSec : prevState.workSec,
            breakMin : newbTime.mins,
            breakSec : newbTime.secs     

          }))
          this.controlInterval();
            }, 50)
        } 
     

  }

  componentDidMount(){
   this.updateComponentTime()
  }

  
}

  
  


//React-Redux timer
const mapStateToPropTimer = (state) => {
  return({
    workState : state.runState
})}

const mapDispatchToStateTimer = dispatch => {
  return {
    switchRunState : currentRunState => {if(currentRunState == runStates.work){
      dispatch(runStateAction(RUNSTATE, runStates.break))
      } else {dispatch(runStateAction(RUNSTATE, runStates.work))}
    }
  }  
}

const ConnectedTimer = connect(mapStateToPropTimer, mapDispatchToStateTimer)(Timer)



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
        <div className="settings flex-row ">
          <h3 id="break-label">Break length</h3>
          <div className="flex-row set-ctrls">
            <h3 id="break-increment"><i className="fa fa-arrow-up"></i></h3> 
            <h3 id="break-length"> 5:00</h3>
            <h3 id="break-decrement"><i className="fa fa-arrow-down"></i></h3>  
          </div>        
        </div>
        <div className="settings flex-row">
          <h3 id="session-label">Session length</h3>
          <div className="flex-row set-ctrls">
            <h3 id="session-increment"><i class="fa fa-arrow-up"></i></h3>
            <h3 id="session-length"> 25:00</h3>
            <h3 id="session-decrement"><i class="fa fa-arrow-down"></i></h3> 
          </div>          
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

const st = store.getState().settings.workSetting;
console.log(st)