import React from 'react';
import ReactSlider from './slider.react';
import UploadButton from './upload_button.react.js';
import SettingsAction from '../actions/settings_action';
import ModelsAction from '../actions/models_action';


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

        <UploadButton
          buttonLabel="browse"
          label="Drag and drop 3D model onto this window or "
          onBrowse={ModelsAction.browse}
          onDragAndDrop={ModelsAction.dragAndDrop}
        />

        <div id="checkbox">
          <div>
            <label>Merge geometries </label>
            <input
              onChange={SettingsAction.mergeGeometries}
              type="checkbox">
            </input>
            </div>
          <div>
            <label>Examine model </label>
            <input
              onChange={SettingsAction.examineModel}
              type="checkbox">
            </input>
          </div>
        </div>

        <div id="sliders">
          <ReactSlider
            onMouseDown={SettingsAction.setSliderBusy}
            onMouseUp={SettingsAction.setSliderBusy}
            onChange={SettingsAction.setModelScale}
            min={0.05} max={10} step={0.05}
            value={this.props.scale}
            label="Model scale: "
          />
          <ReactSlider
            onMouseDown={SettingsAction.setSliderBusy}
            onMouseUp={SettingsAction.setSliderBusy}
            onChange={SettingsAction.setGridSize}
            min={1} max={10} step={0.5}
            value={this.props.gridSize}
            label="Grid size: "
          />
          <ReactSlider
            onMouseDown={SettingsAction.setSliderBusy}
            onMouseUp={SettingsAction.setSliderBusy}
            onChange={SettingsAction.setNumberOfModels}
            min={1} max={this.props.maxNumberOfModels} step={1}
            value={this.props.numberOfModels}
            label="Number of models: "
          />
        </div>

        <div id="message"></div>
        <div id="parsetime"></div>
      </div>
    );
  }
}

Controls.propTypes = {
  gridSize: React.PropTypes.number,
  maxNumberOfModels: React.PropTypes.number,
  numberOfModels: React.PropTypes.number,
  scale: React.PropTypes.number
};

export default Controls;
