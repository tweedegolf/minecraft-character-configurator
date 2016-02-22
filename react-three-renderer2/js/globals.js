import THREE from 'three';

export default {

  WORLD_ROTATION: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2),
  MAX_MERGE: 100

};
