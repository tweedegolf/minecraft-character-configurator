//import React, {Component} from 'react'
import {connect} from 'react-redux'
import {setSliderBusy, sliderChange} from '../actions'
import ReactSlider from '../components/slider.react'

const mapStateToProps = (state, ownProps) => {
  let {min: min = 1, max: max = 100, step: step = 1} = ownProps
  return {
    value: state[ownProps.type],
    min: min,
    max: max,
    step: step
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onMouseDown: (e) => {
      dispatch(setSliderBusy(e))
    },
    onMouseUp: (e) => {
      dispatch(setSliderBusy(e))
    },
    onChange: (e) => {
      dispatch(sliderChange(e, ownProps.type))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReactSlider)
