import React from 'react';

let labelStyle = {
  width: '140px',
  height: '1.9em',
  display: 'inline-block'
};

let inputStyle = {
  verticalAlign: 'middle',
  //marginBottom: '5px',
  width: '200px'
};

/* React wrapper for input type Range */

class Slider extends React.Component{

  static displayName = 'Slider';

  render(){
    let value = this.props.value;
    function createLabel(props){
      let label = value;
      if(props.label){
        label = props.label + '<em>' + value + '</em>';
      }
      return {__html: label};
    }
    return (
      <div>
        <label htmlFor={this.props.id} style={labelStyle} dangerouslySetInnerHTML={createLabel(this.props)} />
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
