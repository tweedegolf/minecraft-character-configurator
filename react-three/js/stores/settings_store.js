import THREE from 'three';
import EventEmitter from 'events';
import ActionTypes from '../constants';
import AppDispatcher from '../app_dispatcher';
import Globals from '../globals';

let CHANGE_EVENT = 'change';


class SettingsStore extends EventEmitter {

  constructor () {
    super();

    this.legLength = 40;
    this.legSize = 10;
    this.bodyWidth = 30;
    this.bodyHeight = 50;
    this.bodyDepth = 20;
    this.headSize = 15;
    this.armSize = 8;
    this.armLength = 35;
    this.sceneRotation = new THREE.Quaternion();
    this.worldRotation = Globals.WORLD_ROTATION;
    this.sliderBusy = false;
    this.cameraPosition = new THREE.Vector3(0, 300, 500);
    this.cameraQuaternion = new THREE.Quaternion();

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

    let legLength = this.legLength;
    let legSize = this.legSize;
    let bodyWidth = this.bodyWidth;
    let bodyHeight = this.bodyHeight;
    let bodyDepth = this.bodyDepth;
    let headSize = this.headSize;
    let armSize = this.armSize;
    let armLength = this.armLength;

    let settings = {

      legLength: legLength,
      legSize: legSize,
      bodyWidth: bodyWidth,
      bodyHeight: bodyHeight,
      bodyDepth: bodyDepth,
      headSize: headSize,
      armSize: armSize,
      armLength: armLength,

      config: {
        head: {
          size: {x: headSize, y: headSize, z: headSize},
          position: {x: 0, y: 0, z: (legLength + bodyHeight) + (headSize / 2)},
          color: 0xcc00cc
        },
        body: {
          size: {x: bodyWidth, y: bodyDepth, z: bodyHeight},
          position: {x: 0, y: 0, z: legLength + (bodyHeight / 2)},
          color: 0xccc000
        },
        leftLeg: {
          size: {x: legSize, y: legSize, z: legLength},
          position: {x: -((bodyWidth / 2) - (legSize / 2)), y: 0, z: (legLength / 2)},
          color: 0x0cc000
        },
        rightLeg: {
          size: {x: legSize, y: legSize, z: legLength},
          position: {x: ((bodyWidth / 2) - (legSize / 2)), y: 0, z: (legLength / 2)},
          color: 0x0cc000
        },
        leftArm: {
          size: {x: armSize, y: armSize, z: armLength},
          position: {x: -((bodyWidth / 2) + (armSize / 2)), y: 0, z: (legLength + bodyHeight) - (armLength / 2)},
          color: 0x00ccc0
        },
        rightArm: {
          size: {x: armSize, y: armSize, z: armLength},
          position: {x: ((bodyWidth / 2) + (armSize / 2)), y: 0, z: (legLength + bodyHeight) - (armLength / 2)},
          color: 0x00ccc0
        }
      },
      worldRotation: this.worldRotation,
      sceneRotation: this.sceneRotation, // not in use yet
      sliderBusy: this.sliderBusy,
      cameraPosition: this.cameraPosition,
      cameraQuaternion: this.cameraQuaternion
    };
    return settings;
  }

  handle(action) {
    switch(action.type) {

      case ActionTypes.HEAD_SIZE:
        this.headSize = action.value;
        this.emitChange();
        break;

      case ActionTypes.BODY_WIDTH:
        this.bodyWidth = action.value;
        this.emitChange();
        break;

      case ActionTypes.BODY_HEIGHT:
        this.bodyHeight = action.value;
        this.emitChange();
        break;

      case ActionTypes.BODY_DEPTH:
        this.bodyDepth = action.value;
        this.emitChange();
        break;

      case ActionTypes.ARM_SIZE:
        this.armSize = action.value;
        this.emitChange();
        break;

      case ActionTypes.ARM_LENGTH:
        this.armLength = action.value;
        this.emitChange();
        break;

      case ActionTypes.LEG_SIZE:
        this.legSize = action.value;
        this.emitChange();
        break;

      case ActionTypes.LEG_LENGTH:
        this.legLength = action.value;
        this.emitChange();
        break;

      case ActionTypes.SLIDER_BUSY:
        this.sliderBusy = action.value;
        //console.log(this.sliderBusy);
        this.emitChange();
        break;

      case ActionTypes.UPDATE_CAMERA:
        this.cameraPosition = action.position;
        this.cameraQuaternion = action.quaternion;
        this.emitChange();
        break;

      default:
      // do nothing
    }
  }
}

export default new SettingsStore();
