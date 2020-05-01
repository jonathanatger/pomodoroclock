import {combineReducers, createStore} from 'redux'
let RUNSTATE = require('./utils.js').RUNSTATE;
let runStates = require('./utils.js').runStates;
let SETTINGS = require('./utils.js').SETTINGS;
let TIMERSET = require('./utils.js').TIMERSET;
let RUNNING = require('./utils.js').RUNNING;
let PAUSE = require('./utils.js').PAUSE;

const initialState = {
    workSetting : "25",
    breakSetting : "05"  
}

export const sessionStatusAction = (runstate) => {
  return({
  type : runstate
  })
}

export const runningStatusAction = (runstate, sessionState) => {
  return({
  type : runstate,
  sessionStatus : sessionState
  })
}

export const settingsAction = (workSg, breakSg) => {
  return({
  type : SETTINGS,
  settings : {workSetting : workSg, breakSetting : breakSg},
  })
}

export const workSettingsIncrementAction = () => {
  return({
    type : "INCREMENT-WS",    
  })
}

export const workSettingsDecrementAction = () => {
  return({
    type : "DECREMENT-WS",    
  })
}

export const breakSettingsIncrementAction = () => {
  return({
    type : "INCREMENT-BS",    
  })
}

export const breakSettingsDecrementAction = () => {
  return({
    type : "DECREMENT-BS",    
  })
}


export const timerAction = (workMin, workSec, breakMin, breakSec) => {
  return({
    type : TIMERSET,
    timer : {
      workMinutes : workMin,
      workSeconds : workSec,
      breakMinutes : breakMin,
      breakSeconds : breakSec,
    }
  })
}

const sessionStatusReducer = (state = runStates.work, action) => {
  switch (action.type){
    case runStates.work :
      return runStates.work;
    case runStates.break :
      return runStates.break;
    default : 
      return state;
  }
}

const runningStatusReducer = (state = runStates.pause, action) => {
  switch (action.type){
    case runStates.running :
      launchTimer(action.sessionStatus);
      return runStates.running
    case runStates.pause :
      stopTimer();
      return  runStates.pause
    default :
      return state;
  }
}

//utility function (NOT A REDUCER)
const updateTimer = function(mins, secs){
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

  return {mins : _newMins, secs : _newSecs}
}

//variable getting the interval that will fire the function updating the timer regularly
var timerInterval = null;

//launches the interval that will fire the function updating the timer regularly
const launchTimer = (currentSessionStatus) => {
  //in case the function was already running.
  try {clearInterval(timerInterval);}
  catch {}

  if(currentSessionStatus == runStates.work){
    timerInterval = setInterval( () => {
      let currentTimer = store.getState().timer;
      
      let newwTime = updateTimer(currentTimer.workMinutes, currentTimer.workSeconds);
      
      
       store.dispatch(timerAction(
        newwTime.mins,
        newwTime.secs ,
        currentTimer.breakMinutes,
        currentTimer.breakSeconds  
          ))       
      
          
      controlInterval(currentSessionStatus, currentTimer);
      
      }      
        , 100)

  } else if (currentSessionStatus == runStates.break){
    timerInterval = setInterval( () => {
      let currentTimer = store.getState().timer;
      let newwTime = updateTimer(currentTimer.breakMinutes, currentTimer.breakSeconds);
      
      store.dispatch(timerAction(
        currentTimer.workMinutes,
        currentTimer.workSeconds,
        newwTime.mins,
        newwTime.secs , 
          ))        
  
      controlInterval(currentSessionStatus, currentTimer);
      }      
        , 100)
      
  }
} 

//stops the interval that updates the timer
const stopTimer = () => {
  try{clearInterval(timerInterval)}
  catch{};
}

//Rotate the UI
let rotateComponent = (id, currentSessionStatus) => {    
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
    
    if((id == "timer-work" && currentSessionStatus == runStates.work)||
    (id == "timer-break" && currentSessionStatus == runStates.break)){
    rotation(elem, 2000, 0, 180);
    }else{rotation(elem, 2000, 180, 180);}
}

const controlInterval = function(sessionStatus, timerState) {
  
  
  let currentMinutes = "";
  let currentSeconds = "";
  let oppositeState = "";

  if (sessionStatus == runStates.work){
    currentMinutes = timerState.workMinutes;
    currentSeconds = timerState.workSeconds;
    oppositeState = runStates.break;

  } else if (sessionStatus == runStates.break){
    currentMinutes = timerState.breakMinutes;
    currentSeconds = timerState.breakSeconds;
    oppositeState = runStates.work;
  }

  

  if (currentMinutes == "00" && currentSeconds == "00"){
    stopTimer();
    rotateComponent("timer-work", sessionStatus);  
    rotateComponent("timer-break", sessionStatus); 
    
    store.dispatch(timerAction(initialState.workSetting,
      "00",
      initialState.breakSetting,
      "00"));
    store.dispatch(sessionStatusAction(oppositeState));
    store.dispatch(runningStatusAction(runStates.running, oppositeState));
  }
} 

const settingsReducer = (state = {workSetting : initialState.workSetting, breakSetting : initialState.breakSetting}, action) => {
  switch (action.type){
    

    case "INCREMENT-WS" :
      let IWSint = parseInt(state.workSetting) + 1;
      let IWS = IWSint.toString();
      if(IWSint < 60) { initialState.workSetting = IWS.length > 1 ? IWS : "0" + IWS };
      return Object.assign({}, initialState);

    case "DECREMENT-WS" :
      let DWSint = parseInt(state.workSetting) - 1;
      let DWS = DWSint.toString();
      if(DWS > 1) { initialState.workSetting = DWS.length > 1 ? DWS : "0" + DWS } ;     
      return Object.assign({}, initialState);
      
    case "INCREMENT-BS" :
      let IBSint = parseInt(state.breakSetting) + 1; 
      let IBS = IBSint.toString();
      if(IBS < 60) { initialState.breakSetting = IBS.length > 1 ? IBS : "0" + IBS } 
      return Object.assign({}, initialState);

    case "DECREMENT-BS" :
      let DBSint = parseInt(state.breakSetting) - 1; 
      let DBS = DBSint.toString();
      if(DBS > 1) { initialState.breakSetting = DBS.length > 1 ? DBS : "0" + DBS }  
      return Object.assign({}, initialState);

    default :
      return state;
  }
}

const timerReducer = (state = {workMinutes : initialState.workSetting,
                                workSeconds : "00",
                                breakMinutes : initialState.breakSetting,
                                breakSeconds : "00"}, action) => {
    switch (action.type){
      case TIMERSET :
        return {workMinutes : action.timer.workMinutes,
        workSeconds : action.timer.workSeconds,
        breakMinutes : action.timer.breakMinutes,
        breakSeconds : action.timer.breakSeconds};
      default :
        return state;
    }
  }


const rootReducer = combineReducers({
  sessionStatus : sessionStatusReducer,
  runningStatus : runningStatusReducer,
  settings : settingsReducer,
  timer : timerReducer
})

export const store = createStore(rootReducer); 