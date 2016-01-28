import React from 'react';
import ReactSlider from './slider.react';
import SettingsAction from '../actions/settings_action';

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
    //console.log('should update', u);
    return u;
  }

  render(){
    return(
      <div id="controls">
        <div id="sliders">
          <ReactSlider
            onMouseDown={SettingsAction.setSliderBusy}
            onMouseUp={SettingsAction.setSliderBusy}
            onChange={SettingsAction.setHeadSize}
            min={1} max={100} step={1}
            value={this.props.headSize}
            label="head size: "
          />
          <ReactSlider
            onMouseDown={SettingsAction.setSliderBusy}
            onMouseUp={SettingsAction.setSliderBusy}
            onChange={SettingsAction.setLegLength}
            min={1} max={100} step={1}
            value={this.props.legLength}
            label="leg length: "
          />
          <ReactSlider
            onMouseDown={SettingsAction.setSliderBusy}
            onMouseUp={SettingsAction.setSliderBusy}
            onChange={SettingsAction.setArmLength}
            min={1} max={100} step={1}
            value={this.props.armLength}
            label="arm length: "
          />
        </div>
      </div>
    );
  }
}

Controls.propTypes = {
  // gridSize: React.PropTypes.number,
  // maxNumberOfModels: React.PropTypes.number,
  // numberOfModels: React.PropTypes.number,
  // scale: React.PropTypes.number
};

export default Controls;
