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

export const runningStatusAction = (runstate) => {
  return({
  type : runstate
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
      return runStates.running
    case runStates.pause :
      return  runStates.pause
    default :
      return state;
  }
}



const settingsReducer = (state = {workSetting : "25", breakSetting : "05"}, action) => {
  switch (action.type){
    case SETTINGS :
      initialState.workSetting = action.settings.workSetting;
      initialState.breakSetting = action.settings.breakSetting;
      return initialState;
    case "INCREMENT-WS" :
      let IWS = (state.workSetting + 1).toString();
      if(IWS < 60) { initialState.workSetting = IWS.length > 1 ? IWS : "0" + IWS }      
      return initialState;
    case "DECREMENT-WS" :
      let DWS = (state.workSetting - 1).toString();
      if(DWS > 1) { initialState.workSetting = DWS.length > 1 ? DWS : "0" + DWS }      
      return initialState;
      
    case "INCREMENT-BS" :
      let IBS = "32" ; 
      if(IBS < 60) { initialState.breakSetting = IBS.length > 1 ? IBS : "0" + IBS }      
      return initialState.assign();
    case "DECREMENT-BS" :
      let DBS = (state.breakSetting - 1).toString();
      if(DBS > 1) { initialState.breakSetting = DBS.length > 1 ? DBS : "0" + DBS }      
      return initialState;
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