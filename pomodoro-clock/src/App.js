import React from 'react';
import './App.css';

import {Provider, connect} from 'react-redux';
import {store, sessionStatusAction, runningStatusAction, workSettingsDecrementAction, workSettingsIncrementAction, breakSettingsIncrementAction,  breakSettingsDecrementAction, timerAction} from './redux.js'

let RUNSTATE = require('./utils.js').RUNSTATE;
let runStates = require('./utils.js').runStates;
let SETTINGS = require('./utils.js').SETTINGS;

//React -----------------------------



class App extends React.Component {
  
  render(){
    return(
      <div>
        <div className="header">
          <h1 className="main-title">Pomodoro Clock</h1>
          
        </div>
        <div className="app" >
          <ConnectedTimer />
          <ConnectedSettingsTab />     
        </div>
      </div>
    )
  }
}


class Timer extends React.Component{
  constructor(props){
    super(props);
    /*
    this.controlInterval = this.controlInterval.bind(this);
    this.updateComponentTime = this.updateComponentTime.bind(this);
    this.rotateComponent = this.rotateComponent.bind(this);
    */
    /*
    this.state = {
      workMin : store.getState()["settings"].workSetting,
      workSec : "00",
      breakMin : store.getState()["settings"].breakSetting,
      breakSec : "00",
    }
    */
  }


  render(){
      return(
      <div>
        <div className="timer work" id="timer-work">
          <p id="timer-label" className="timer-label">Session</p>
          <p id="time-left" className="timer-numbers">{this.props._timer.workMinutes + ":" + this.props._timer.workSeconds}</p>        
        </div>
        <div className="timer break" id="timer-break">
          <p id="timer-label-break" className="timer-label">Break</p>
          <p id="time-left-break" className="timer-numbers">{this.props._timer.breakMinutes + ":" + this.props._timer.breakSeconds}</p>        
        </div>
      </div>
    )
  }
  
                  /*
                  //Shutsdown intervals and decides when the component rotates
                  controlInterval(){
                    if((this.props.workState == runStates.pause)){
                      clearInterval(this.timerInterval)
                    }
                    else if((this.state.workMin == "00" && this.state.workSec == "00")||(this.state.breakMin == "00" && this.state.breakSec == "00")){
                    this.props.switchRunState(this.props.workState);
                    clearInterval(this.timerInterval);
                        
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

                  // Allow the timers to rotate
                  rotateComponent(id){    
                    let elem = document.getElementById(id)

                    const rotation = function(el, time, start, degrees){
                      let i = start;
                      let inter = setInterval(
                        (elem) =>{
                          if (i<= start+degrees){
                            el.style.transform = `translateX(-50%) rotate(${i}deg)`
                            el.style.WebkitTransform = `translateX(-50%) rotate(${i}deg)`
                            el.style.MozTransform = `translateX(-50%) rotate(${i}deg)`
                            el.style.OTransform = `translateX(-50%) rotate(${i}deg)`
                            i += 0.5          }
                          else {clearInterval(inter)}},
                        time/(degrees*2))
                      }
                      
                      if((id == "timer-work" && this.props.workState == runStates.break)||
                      (id == "timer-break" && this.props.workState == runStates.work)){
                      rotation(elem, 2000, 0, 180);
                      }else{rotation(elem, 2000, 180, 180);}
                  }

                    //Given an input of the curren time, outputs the time one second later
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

                  //given the current state, makes the appropriate changes to the timer
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
                          , 100)
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
                            }, 100)
                        }
                    else if (this.workState == runStates.pause){
                      try{clearInterval(this.timerInterval);}
                      catch{}
                    }
                  }
                  */

  componentDidMount(){
   
  }
  //End of Timer
}

//React-Redux timer
const mapStateToPropTimer = (state) => {
  return({
    _sessionStatus : state.sessionStatus,
    _timer : state.timer
})}

const mapDispatchToStateTimer = dispatch => {
  return {
    switchRunState : currentRunState => {if(currentRunState == runStates.work){
      dispatch(sessionStatusAction(runStates.break))
      } else {dispatch(sessionStatusAction(runStates.work))}
    }
  }  
}

const ConnectedTimer = connect(mapStateToPropTimer, mapDispatchToStateTimer)(Timer)

//Component holding the settings controls to determine the timer behavior
class SettingsTab extends React.Component{
  constructor(props){
    super(props);
      this.changeRunningState = this.changeRunningState.bind(this)
      this.changeSessionState = this.changeSessionState.bind(this)
  }
      

    // set the store state
  changeRunningState(){
    let storeRunningState = store.getState().runningStatus;
     
    if(storeRunningState == runStates.pause){
      this.props.runRunState();
      document.getElementById("start_stop").innerHTML = store.getState().runningStatus.toString()

    } else if(storeRunningState == runStates.running){
      this.props.pauseRunState();
      document.getElementById("start_stop").innerHTML = store.getState().runningStatus.toString()
    }
  }

  changeSessionState(){
    let storeSessionState = store.getState().sessionStatus;

    if(storeSessionState == runStates.work){
     this.props.breakRunState();
     document.getElementById("reset").innerHTML = store.getState().sessionStatus.toString()

    } else if(storeSessionState == runStates.break){
     this.props.workRunState();
     document.getElementById("reset").innerHTML = store.getState().sessionStatus.toString()
    }
 }
  
  reset(){
    
  }


 
  render(){
    return(
      <div className="settings-tab" >
         <div className='custom-border'></div>
        <div className="timer-controls">
          <button id="start_stop" onClick={this.changeRunningState}>Go/Stop</button>
          <button id="reset" onClick={this.props.resetTimer} >Reset</button>
        </div>
        <div className="settings flex-row ">
          <h3 id="break-label">Break length</h3>
          <div className="flex-row set-ctrls">
            <h3 id="break-increment" onClick={this.props.incBreakSetting} ><i className="fa fa-arrow-up"></i></h3> 
            <h3 id="break-length">{store.getState().settings.breakSetting + ":00"}</h3>
            <h3 id="break-decrement"onClick={this.props.decBreakSetting}><i className="fa fa-arrow-down"></i></h3>  
          </div>        
        </div>
        <div className="settings flex-row">
          <h3 id="session-label">Session length</h3>
          <div className="flex-row set-ctrls">
            <h3 id="session-increment" onClick={this.props.incWorkSetting}><i class="fa fa-arrow-up"></i></h3>
            <h3 id="session-length">{store.getState().settings.workSetting + ":00"}</h3>
            <h3 id="session-decrement" onClick={this.props.decWorkSetting}><i class="fa fa-arrow-down"></i></h3> 
          </div>          
        </div>
        <div className='custom-border'></div>
      </div>
    )
  }

}

const mapDispatchToStateSettings = dispatch => { return{
  pauseRunState : () => dispatch(runningStatusAction(runStates.pause)),
  runRunState : () => dispatch(runningStatusAction(runStates.running)),
  breakRunState : () => dispatch(sessionStatusAction(runStates.break)),
  workRunState : () => dispatch(sessionStatusAction(runStates.work))  ,
  incWorkSetting : () => dispatch( workSettingsIncrementAction())      ,
  decWorkSetting : () => dispatch( workSettingsDecrementAction())      ,
  incBreakSetting : () => dispatch( breakSettingsIncrementAction())      ,
  decBreakSetting : () => dispatch( breakSettingsDecrementAction())      ,
  resetTimer : () => dispatch(timerAction(
            store.getState().settings.workSetting,
            "00",
            store.getState().settings.breakSetting,
            "00"
            )) 
  }
}

const ConnectedSettingsTab = connect(null, mapDispatchToStateSettings)(SettingsTab)





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