import React from 'react';
import Slider from '../containers/slider_container';
import * as types from '../constants/action_types';

class Controls extends React.Component{

  static displayName = 'Controls';

  constructor(props){
    super(props);
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
