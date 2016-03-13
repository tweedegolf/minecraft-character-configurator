import 'babel-polyfill'
import App from './components/app.react'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import configureStore from './stores/configure_store'

window.onload = function(){

  let store = configureStore()

  ReactDOM.render(
    <Provider store={store}>
      <App store={store}/>
    </Provider>,
    document.getElementById('app')
  )
}
