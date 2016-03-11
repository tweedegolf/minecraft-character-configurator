require('babel-polyfill');

import App from './components/app.react';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import minecraftApp from './reducers';

window.onload = function(){

  let store = createStore(minecraftApp);

  ReactDOM.render(
    <Provider store={store}>
      <App store={store}/>
    </Provider>,
    document.getElementById('app')
  );
};
