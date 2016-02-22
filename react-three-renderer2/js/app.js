require('babel-polyfill');

import App from './components/app.react';
import React from 'react';
import ReactDOM from 'react-dom';

window.onload = function(){

  ReactDOM.render(
    <App />,
    document.getElementById('app')
  );
};
