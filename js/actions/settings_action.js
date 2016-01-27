import AppDispatcher from '../app_dispatcher';
import ActionTypes from '../constants';

export default {

  setModelScale(e) {
    AppDispatcher.dispatch({
      type: ActionTypes.MODEL_SCALE,
      modelScale: e.target.valueAsNumber
    });
  },

  setGridSize(e) {
    AppDispatcher.dispatch({
      type: ActionTypes.GRID_SIZE,
      gridSize: e.target.valueAsNumber
    });
  },

  setNumberOfModels(e) {
    AppDispatcher.dispatch({
      type: ActionTypes.NUMBER_OF_MODELS,
      numberOfModels: e.target.valueAsNumber
    });
  },

  mergeGeometries(e) {
    AppDispatcher.dispatch({
      type: ActionTypes.MERGE_GEOMETRIES,
      mergeGeometries: e.target.checked
    });
  },

  examineModel(e) {
    AppDispatcher.dispatch({
      type: ActionTypes.EXAMINE_MODEL,
      examineModel: e.target.checked
    });
  },

  setSliderBusy(e) {
    AppDispatcher.dispatch({
      type: ActionTypes.SLIDER_BUSY,
      sliderBusy: e.nativeEvent.type === 'mousedown'
    });
  }
};
