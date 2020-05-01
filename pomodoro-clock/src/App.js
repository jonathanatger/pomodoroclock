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
        <div className="app" id="app" >
          <ConnectedTimer />
          <ConnectedSettingsTab />             
        </div>
      </div>
    )
  }
}


class Timer extends React.Component{
  
  componentDidMount(){
    let c = document.getElementById("canvas", {antialias : true, depth : true});
    let ctx = c.getContext("2d");
    let radius = 160;
    ctx.strokeStyle = "rgb(238, 194, 194)";
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.arc(210,210, radius, 0.7 * Math.PI, 1.3 * Math.PI);    
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(210,210, radius, 1.7 * Math.PI, 2 * Math.PI);
    ctx.stroke()
    

    ctx.beginPath();
    ctx.arc(210,210, radius, 0, 0.3 * Math.PI);
    ctx.stroke()
  }
  render(){   

      return(
      <div>
        <div className="timer work" id="timer-work">
           
          <p id="timer-label" className="timer-label">Session</p>
          <p id="time-left" className="timer-numbers">{this.props._timer.workMinutes + ":" + this.props._timer.workSeconds}</p> 
          <canvas className="canvas" width="420px" height="420px" id="canvas"></canvas>      
        </div>
        <div className="timer break" id="timer-break">
          <p id="timer-label-break" className="timer-label">Break</p>
          <p id="time-left-break" className="timer-numbers">{this.props._timer.breakMinutes + ":" + this.props._timer.breakSeconds}</p>        
        </div>
        
      </div>
    )
  }
                  
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
    } else if(storeRunningState == runStates.running){
      this.props.pauseRunState();
    }
  }

  changeSessionState(){
    let storeSessionState = store.getState().sessionStatus;
    if(storeSessionState == runStates.work){
     this.props.breakRunState();
    } else if(storeSessionState == runStates.break){
     this.props.workRunState();
    }
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
            <h3 id="break-length">{this.props.bSetting + ":00"}</h3>
            <h3 id="break-decrement"onClick={this.props.decBreakSetting}><i className="fa fa-arrow-down"></i></h3>  
          </div>        
        </div>
        <div className="settings flex-row">
          <h3 id="session-label">Session length</h3>
          <div className="flex-row set-ctrls">
            <h3 id="session-increment" onClick={this.props.incWorkSetting}><i class="fa fa-arrow-up"></i></h3>
            <h3 id="session-length">{this.props.wSetting + ":00"}</h3>
            <h3 id="session-decrement" onClick={this.props.decWorkSetting}><i class="fa fa-arrow-down"></i></h3> 
          </div>          
        </div>
        <div className='custom-border'></div>
      </div>
    )
  }
}

const mapDispatchToStateSettings = dispatch => { return{
  pauseRunState : () => dispatch(runningStatusAction(runStates.pause, store.getState().sessionStatus)),
  runRunState : () => dispatch(runningStatusAction(runStates.running, store.getState().sessionStatus)),
  breakRunState : () => dispatch(sessionStatusAction(runStates.break)),
  workRunState : () => dispatch(sessionStatusAction(runStates.work))  ,
  incWorkSetting : () => dispatch( workSettingsIncrementAction())      ,
  decWorkSetting : () => dispatch( workSettingsDecrementAction())      ,
  incBreakSetting : () => dispatch( breakSettingsIncrementAction())      ,
  decBreakSetting : () => dispatch( breakSettingsDecrementAction())      ,
  resetTimer : () => {
    dispatch(timerAction(store.getState().settings.workSetting, "00",
                        store.getState().settings.breakSetting, "00"  ));
    dispatch(runningStatusAction(runStates.pause, store.getState().sessionStatus));
    dispatch(sessionStatusAction(runStates.work));
    setTimeout(() => {
    let elem = document.getElementById("timer-work") 
      elem.style.transform = `translateX(-50%) rotate(0deg)`
      elem.style.WebkitTransform = `translateX(-50%) rotate(0deg)`
      elem.style.MozTransform = `translateX(-50%) rotate(0deg)`
      elem.style.OTransform = `translateX(-50%) rotate(0deg)`
    let elem2 = document.getElementById("timer-break") 
      elem2.style.transform = `translateX(-50%) rotate(180deg)`
      elem2.style.WebkitTransform = `translateX(-50%) rotate(180deg)`
      elem2.style.MozTransform = `translateX(-50%) rotate(180deg)`
      elem2.style.OTransform = `translateX(-50%) rotate(180deg)`},
      2000)
                     
    }
  }
}
  

const mapStateToPropSettings = state => ({
    wSetting : state.settings.workSetting,
    bSetting : state.settings.breakSetting
  })


const ConnectedSettingsTab = connect(mapStateToPropSettings, mapDispatchToStateSettings)(SettingsTab)





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