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
            onChange={SettingsAction.setBodyWidth}
            min={1} max={100} step={1}
            value={this.props.bodyWidth}
            label="body width: "
          />
          <ReactSlider
            onMouseDown={SettingsAction.setSliderBusy}
            onMouseUp={SettingsAction.setSliderBusy}
            onChange={SettingsAction.setBodyHeight}
            min={1} max={100} step={1}
            value={this.props.bodyHeight}
            label="body height: "
          />
          <ReactSlider
            onMouseDown={SettingsAction.setSliderBusy}
            onMouseUp={SettingsAction.setSliderBusy}
            onChange={SettingsAction.setBodyDepth}
            min={1} max={100} step={1}
            value={this.props.bodyDepth}
            label="body depth: "
          />

          <ReactSlider
            onMouseDown={SettingsAction.setSliderBusy}
            onMouseUp={SettingsAction.setSliderBusy}
            onChange={SettingsAction.setArmSize}
            min={1} max={50} step={1}
            value={this.props.armSize}
            label="arm size: "
          />
          <ReactSlider
            onMouseDown={SettingsAction.setSliderBusy}
            onMouseUp={SettingsAction.setSliderBusy}
            onChange={SettingsAction.setArmLength}
            min={1} max={100} step={1}
            value={this.props.armLength}
            label="arm length: "
          />

          <ReactSlider
            onMouseDown={SettingsAction.setSliderBusy}
            onMouseUp={SettingsAction.setSliderBusy}
            onChange={SettingsAction.setLegSize}
            min={1} max={50} step={1}
            value={this.props.legSize}
            label="leg size: "
          />
          <ReactSlider
            onMouseDown={SettingsAction.setSliderBusy}
            onMouseUp={SettingsAction.setSliderBusy}
            onChange={SettingsAction.setLegLength}
            min={1} max={100} step={1}
            value={this.props.legLength}
            label="leg length: "
          />
        </div>
      </div>
    );
  }
}

Controls.propTypes = {
  headSize: React.PropTypes.number,
  bodyWidth: React.PropTypes.number,
  bodyHeight: React.PropTypes.number,
  bodyDepth: React.PropTypes.number,
  armSize: React.PropTypes.number,
  armLength: React.PropTypes.number,
  legSize: React.PropTypes.number,
  legLength: React.PropTypes.number
};

export default Controls;
