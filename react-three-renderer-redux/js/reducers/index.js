import THREE from 'three';
import * as types from '../constants/action_types';
import * as globals from '../constants/globals';


const initialState = {
  legLength: 40,
  legSize: 10,
  bodyWidth: 30,
  bodyHeight: 50,
  bodyDepth: 20,
  headSize: 15,
  armSize: 8,
  armLength: 35,
  sceneRotation: new THREE.Quaternion(),
  worldRotation: globals.WORLD_ROTATION,
  sliderBusy: false,
  cameraPosition: new THREE.Vector3(0, 300, 500),
  cameraQuaternion: new THREE.Quaternion(),
  autoRender: false
};


function getConfig(state){

  let legLength = state.legLength;
  let legSize = state.legSize;
  let bodyWidth = state.bodyWidth;
  let bodyHeight = state.bodyHeight;
  let bodyDepth = state.bodyDepth;
  let headSize = state.headSize;
  let armSize = state.armSize;
  let armLength = state.armLength;

  return {
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
  };
}


const minecraftApp = (state = initialState, action) => {
  switch(action.type){

    case types.LEG_SIZE:
    case types.LEG_LENGTH:
    case types.ARM_SIZE:
    case types.ARM_LENGTH:
    case types.BODY_LENGTH:
    case types.BODY_WIDTH:
    case types.BODY_HEIGHT:
    case types.BODY_DEPTH:
    case types.HEAD_SIZE:
    case types.SLIDER_BUSY:

      initialState[action.type] = action.payload.value;

      state = Object.assign({}, state, {
        [action.type]: action.payload.value,
        config: getConfig(initialState)
      });
      break;

    case types.CHANGE_RENDER_METHOD:
      console.log('CHANGE_RENDER_METHOD', action.payload.value);
      break;

    default:
      // just return state
  }
  return state;
};

export default minecraftApp;
