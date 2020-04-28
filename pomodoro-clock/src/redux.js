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

const sessionStatusReducer = (state = runStates.pause, action) => {
  switch (action.type){
    case runStates.work :
      return {sessionStatus : runStates.work, running : state.running};
    case runStates.break :
      return {sessionStatus : runStates.break, running : state.running}
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

const settingsReducer = (state = {workSetting : "1", breakSetting : "05"}, action) => {
  switch (action.type){
    case SETTINGS :
      initialState.workSetting = action.settings.workSetting;
      initialState.breakSetting = action.settings.breakSetting;
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