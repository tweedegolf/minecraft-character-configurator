import AppDispatcher from '../app_dispatcher';
import ActionTypes from '../constants';

export default {

  setHeadSize(e) {
    AppDispatcher.dispatch({
      type: ActionTypes.HEAD_SIZE,
      value: e.target.valueAsNumber
    });
  },

  setBodyWidth(e) {
    AppDispatcher.dispatch({
      type: ActionTypes.BODY_WIDTH,
      value: e.target.valueAsNumber
    });
  },

  setBodyHeight(e) {
    AppDispatcher.dispatch({
      type: ActionTypes.BODY_HEIGHT,
      value: e.target.valueAsNumber
    });
  },

  setBodyDepth(e) {
    AppDispatcher.dispatch({
      type: ActionTypes.BODY_DEPTH,
      value: e.target.valueAsNumber
    });
  },

  setLegSize(e) {
    AppDispatcher.dispatch({
      type: ActionTypes.LEG_SIZE,
      value: e.target.valueAsNumber
    });
  },

  setLegLength(e) {
    AppDispatcher.dispatch({
      type: ActionTypes.LEG_LENGTH,
      value: e.target.valueAsNumber
    });
  },

  setArmSize(e) {
    AppDispatcher.dispatch({
      type: ActionTypes.ARM_SIZE,
      value: e.target.valueAsNumber
    });
  },

  setArmLength(e) {
    AppDispatcher.dispatch({
      type: ActionTypes.ARM_LENGTH,
      value: e.target.valueAsNumber
    });
  },

  setSliderBusy(e) {
    AppDispatcher.dispatch({
      type: ActionTypes.SLIDER_BUSY,
      value: e.nativeEvent.type === 'mousedown'
    });
  },

  updateCamera(e){
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_CAMERA,
      position: e.position,
      quaternion: e.quaternion
    });
  }
};
