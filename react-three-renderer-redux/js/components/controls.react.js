import React from 'react';
import Slider from '../containers/slider_container';
import * as types from '../constants/action_types';

class Controls extends React.Component{

  static displayName = 'Controls';

  constructor(props){
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState){
    //let u = Object.is(nextProps, this.props);
    let u = false;
    let keys = Object.keys(nextProps);
    for(let i = keys.length - 1; i >= 0; i--){
      let key = keys[i];
      if(Object.is(nextProps[key], this.props[key]) === false){
        u = true;
        break;
      }
    }
    console.log('should update', u);
    return u;
  }

  render(){
    return(
      <div id="controls">
        <div id="sliders">
          <Slider
            type={types.HEAD_SIZE}
            label="head size: "
          />
          <Slider
            type={types.BODY_WIDTH}
            label="body width: "
          />
          <Slider
            type={types.BODY_HEIGHT}
            label="body height: "
          />
          <Slider
            type={types.BODY_DEPTH}
            label="body depth: "
          />
          <Slider
            type={types.ARM_SIZE}
            label="arm size: "
          />
          <Slider
            type={types.ARM_LENGTH}
            label="arm length: "
          />
          <Slider
            type={types.LEG_SIZE}
            label="leg size: "
          />
          <Slider
            type={types.LEG_LENGTH}
            label="leg length: "
          />
        </div>
      </div>
    );
  }
}

export default Controls;
