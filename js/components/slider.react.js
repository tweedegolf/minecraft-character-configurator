import React from 'react';

let labelStyle = {
  width: '200px',
  display: 'inline-block'
};

let inputStyle = {
  verticalAlign: 'middle',
  width: '70%',
  marginTop: '15px',
  marginBottom: '15px'
};

/* React wrapper for input type Range */

class Slider extends React.Component{

  static displayName = 'Slider';

  render(){
    let value = this.props.value;
    let label = value;
    if(this.props.label){
      label = this.props.label + value;
    }
    return (
      <div>
        <label htmlFor={this.props.id} style={labelStyle}>{label}</label>
        <input
          style={inputStyle}
          onMouseUp={this.props.onMouseUp}
          onMouseDown={this.props.onMouseDown}
          id={this.props.id}
          onChange={this.props.onChange}
          type="range"
          value={value}
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
        />
      </div>
    );
  }
}

Slider.propTypes = {
  id: React.PropTypes.string,
  label: React.PropTypes.string,
  max: React.PropTypes.number,
  min: React.PropTypes.number,
  onChange: React.PropTypes.function,
  step: React.PropTypes.number,
  value: React.PropTypes.number
};

export default Slider;
