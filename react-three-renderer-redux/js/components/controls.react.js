import React from 'react';
import ReactSlider from './slider.react';
import {connect} from 'react-redux';
import * as actions from '../actions';

class Controls extends React.Component{

  static displayName = 'Controls';

  constructor(props, {dispatch}){
    super(props);
    console.log(dispatch);
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
        <div id="button">
          <label>auto render: </label>
          <input
            type="button"
            value={this.props.autoRender ? 'on' : 'off'}
            onClick={actions.changeRenderMethod}
          />
        </div>
        <div id="sliders">
          <ReactSlider
            onMouseDown={actions.setSliderBusy}
            onMouseUp={actions.setSliderBusy}
            onChange={actions.setHeadSize}
            min={1} max={100} step={1}
            value={this.props.headSize}
            label="head size: "
          />

          <ReactSlider
            onMouseDown={actions.setSliderBusy}
            onMouseUp={actions.setSliderBusy}
            onChange={actions.setBodyWidth}
            min={1} max={100} step={1}
            value={this.props.bodyWidth}
            label="body width: "
          />
          <ReactSlider
            onMouseDown={actions.setSliderBusy}
            onMouseUp={actions.setSliderBusy}
            onChange={actions.setBodyHeight}
            min={1} max={100} step={1}
            value={this.props.bodyHeight}
            label="body height: "
          />
          <ReactSlider
            onMouseDown={actions.setSliderBusy}
            onMouseUp={actions.setSliderBusy}
            onChange={actions.setBodyDepth}
            min={1} max={100} step={1}
            value={this.props.bodyDepth}
            label="body depth: "
          />

          <ReactSlider
            onMouseDown={actions.setSliderBusy}
            onMouseUp={actions.setSliderBusy}
            onChange={actions.setArmSize}
            min={1} max={50} step={1}
            value={this.props.armSize}
            label="arm size: "
          />
          <ReactSlider
            onMouseDown={actions.setSliderBusy}
            onMouseUp={actions.setSliderBusy}
            onChange={actions.setArmLength}
            min={1} max={100} step={1}
            value={this.props.armLength}
            label="arm length: "
          />

          <ReactSlider
            onMouseDown={actions.setSliderBusy}
            onMouseUp={actions.setSliderBusy}
            onChange={actions.setLegSize}
            min={1} max={50} step={1}
            value={this.props.legSize}
            label="leg size: "
          />
          <ReactSlider
            onMouseDown={actions.setSliderBusy}
            onMouseUp={actions.setSliderBusy}
            onChange={actions.setLegLength}
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


const mapStateToProps = function(state){

};

const mapDispatchToProps = function(dispatch){

};

const controls = connect(
//  mapStateToProps,
//  mapDispatchToProps
)(Controls);

//export default Controls;
export default controls;
