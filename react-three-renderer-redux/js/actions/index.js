import * as types from '../constants/action_types'


export function changeRenderMethod(e){
  return {
    type: types.CHANGE_RENDER_METHOD,
    payload: {
      value: e.nativeEvent.type
    }
  }
}

export function setSliderBusy(e) {
  return {
    type: types.SLIDER_BUSY,
    payload: {
      value: e.nativeEvent.type === 'mousedown'
    }
  }
}

export function sliderChange(e, type) {
  return {
    type: type,
    payload: {
      value: e.target.valueAsNumber
    }
  }
}

export function updateCamera(e){
  return {
    type: types.UPDATE_CAMERA,
    payload: {
      position: e.position,
      quaternion: e.quaternion
    }
  }
}

export function handleResize(e){
  return {
    type: types.RESIZE,
    payload: {
      width: e.width,
      height: e.height
    }
  }
}
