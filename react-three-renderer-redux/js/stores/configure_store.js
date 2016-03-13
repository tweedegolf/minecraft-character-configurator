import {createStore, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'

const loggerMiddleware = createLogger()
let instance = null

export default function configureStore(initialState){
  if(instance === null){
    instance = createStore(
      rootReducer,
      initialState,
      applyMiddleware(
        loggerMiddleware
      )
    )
  }
  return instance
}

