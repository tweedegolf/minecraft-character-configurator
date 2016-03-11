import * as types from '../constants/action_types';


// export const changeRenderMethod = () => {
//   return {
//     type: types.CHANGE_RENDER_METHOD
//   };
// };

export function init(e){
  return {
    type: types.INIT
  };
}

export function changeRenderMethod(e){
  return {
    type: types.CHANGE_RENDER_METHOD,
    payload: {
      value: e.nativeEvent.type
    }
  };
}

export function setSliderBusy(e) {
  return {
    type: types.SLIDER_BUSY,
    payload: {
      value: e.nativeEvent.type === 'mousedown'
    }
  };
}

export function sliderChange(e, type) {
  return {
    type: type,
    payload: {
      value: e.target.valueAsNumber
    }
  };
}

export function updateCamera(e){
  return {
    type: types.UPDATE_CAMERA,
    payload: {
      position: e.position,
      quaternion: e.quaternion
    }
  };
}


/*

export function setHeadSize(e) {
  return {
    type: types.HEAD_SIZE,
    payload: {
      value: e.target.valueAsNumber
    }
  };
}

export function setBodyWidth(e) {
  return {
    type: types.BODY_WIDTH,
    payload: {
      value: e.target.valueAsNumber
    }
  };
}

export function setBodyHeight(e) {
  return {
    type: types.BODY_HEIGHT,
    payload: {
      value: e.target.valueAsNumber
    }
  };
}

export function setBodyDepth(e) {
  return {
    type: types.BODY_DEPTH,
    payload: {
      value: e.target.valueAsNumber
    }
  };
}

export function setLegSize(e) {
  return {
    type: types.LEG_SIZE,
    payload: {
      value: e.target.valueAsNumber
    }
  };
}

export function setLegLength(e) {
  return {
    type: types.LEG_LENGTH,
    payload: {
      value: e.target.valueAsNumber
    }
  };
}

export function setArmSize(e) {
  return {
    type: types.ARM_SIZE,
    payload: {
      value: e.target.valueAsNumber
    }
  };
}

export function setArmLength(e) {
  return {
    type: types.ARM_LENGTH,
    payload: {
      value: e.target.valueAsNumber
    }
  };
}

*/