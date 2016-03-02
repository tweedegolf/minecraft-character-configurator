import THREE from 'three';
import React from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';

/* main react component, the only component with state */

class App extends React.Component{

  static displayName = 'App';

  constructor({dispatch}){
    super();
    this._dispatch = dispatch;
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  onChange(){
//    let state = SettingsStore.getSettings();
//    this.setState(state);
  }

  render(){
    return(
      <div>
        <button
          value={"click me!"}
          onClick={
            (e) => {
              this._dispatch(actions.changeRenderMethod(e));
            }
          }
        >{"click me"}
        </button>
      </div>
    );
  }
}

App.propTypes = {};


const mapStateToProps = function(state){

};

const mapDispatchToProps = function(dispatch){

};

const app = connect(
//  mapStateToProps,
//  mapDispatchToProps
)(App);

export default app;
//export default App;
