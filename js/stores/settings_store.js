import THREE from 'three';
import EventEmitter from 'events';
import ActionTypes from '../constants';
import AppDispatcher from '../app_dispatcher';

let CHANGE_EVENT = 'change';


class SettingsStore extends EventEmitter {

  constructor () {
    super();

    this.scale = 0.08;
    this.gridSize = 10;
    this.sceneSize = 300;
    this.numberOfModels = 1;
    this.examineModel = false;
    this.mergeGeometries = false;
    this.modelData = {model: {}, textures: {}};
    this.sceneRotation = new THREE.Quaternion();
    this.sliderBusy = false;

    AppDispatcher.register((action) => {
      this.handle(action);
    });
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  getSettings() {
    let settings = {
      scale: this.scale,
      gridSize: this.gridSize,
      sceneSize: this.sceneSize,
      numberOfModels: this.numberOfModels,
      maxNumberOfModels: Math.pow(Math.floor(this.sceneSize / this.gridSize), 2),
      examineModel: this.examineModel,
      mergeGeometries: this.mergeGeometries,
      sceneRotation: this.sceneRotation, // not in use yet
      sliderBusy: this.sliderBusy
    };
    return settings;
  }

  handle(action) {
    switch(action.type) {

      case ActionTypes.MODEL_SCALE:
        this.scale = parseFloat(action.modelScale);
        this.emitChange();
        break;

      case ActionTypes.GRID_SIZE:
        this.gridSize = parseFloat(action.gridSize);
        this.emitChange();
        break;

      case ActionTypes.NUMBER_OF_MODELS:
        this.numberOfModels = parseFloat(action.numberOfModels);
        this.emitChange();
        break;

      case ActionTypes.EXAMINE_MODEL:
        this.examineModel = action.examineModel;
        this.emitChange();
        break;

      case ActionTypes.MERGE_GEOMETRIES:
        this.mergeGeometries = action.mergeGeometries;
        this.emitChange();
        break;

      case ActionTypes.SLIDER_BUSY:
        this.sliderBusy = action.sliderBusy;
        this.emitChange();
        break;

      default:
      // do nothing
    }
  }
}

export default new SettingsStore();
