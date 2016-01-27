import THREE from 'three';
import React from 'react';
//import ReactTHREE from 'react-three';
import ReactTHREE from '../../../lib/react-three-commonjs';
import Box from './box.react';

let Mesh = ReactTHREE.Mesh;
let Object3D = ReactTHREE.Object3D;
let legLength = 30;
let legSize = 10;
let bodyWidth = 10;

let config = {
  head: {
    size: {x: 10, y: 10, z: 10 },
    position: {x: 10, y: 10, z: 10 },
    color: 0xcc0000
  },
  body: {
    size: {x: 10, y: 10, z: 10 },
    position: {x: 10, y: 10, z: 10 },
    color: 0xcc0000
  },
  leftLeg: {
    //size: {x: legSize, y: legSize, z: legLength},
    size: {x: 10, y: 10, z: 10 },
    //position: {x: -(bodyWidth / 2), y: 0, z: 0},
    position: {x: 0, y: 0, z: 0},
    color: 0xcc0000
  },
  rightLeg: {
    size: {x: legSize, y: legSize, z: legLength},
    position: {x: (bodyWidth / 2), y: 0, z: 0},
    color: 0x00cc00
  },
  leftArm: {
    size: {x: 10, y: 10, z: 10 },
    position: {x: 10, y: 10, z: 10 },
    color: 0xcc0000
  },
  rightArm: {
    size: {x: 10, y: 10, z: 10 },
    position: {x: 10, y: 10, z: 10 },
    color: 0xcc0000
  }
}

class Minecraft extends React.Component {

  static displayName = 'Minecraft';

  constructor(props) {
    super(props);
  }

  render() {

    let size = 50;
    //this.props.position.z = (size / 2) * (this.props.scale || 1);
    return (
      <Object3D
          position={this.props.position}
          quaternion={this.props.quaternion}
          scale={this.props.scale}
        >
        <Box
          size={config.leftLeg.size}
          color={config.leftLeg.color}
          position={config.leftLeg.position}
        />
      </Object3D>
    );
  }
}

Minecraft.propTypes = {
  position: React.PropTypes.instanceOf(THREE.Vector3),
  quaternion: React.PropTypes.instanceOf(THREE.Quaternion),
  scale: React.PropTypes.number
};

export default Minecraft;
