import THREE from 'three';
import React from 'react';
import ReactTHREE from 'react-three';

let Object3D = ReactTHREE.Object3D;
let Mesh = ReactTHREE.Mesh;

class World extends React.Component{

  static displayName = 'World';

  constructor(props){
    super(props);
    this.geometry = new THREE.PlaneBufferGeometry(300, 300, 30, 30);
    this.material = new THREE.MeshBasicMaterial({opacity: 0.5, color: 0x333000, side: THREE.DoubleSide, wireframe: true});
  }

  render() {
    return (
      <Object3D
        key={'world'}
        quaternion={this.props.worldRotation}
      >
        <Mesh
          key={THREE.Math.generateUUID()} // the key has to be unique otherwise it won't render after an update, I think this is weird
          //key={'floor'}
          geometry={this.geometry}
          material={this.material}
          position={this.props.position}
        >
        {this.props.children}
        </Mesh>
      </Object3D>
    );
  }
}

World.propTypes = {
  position: React.PropTypes.instanceOf(THREE.Vector3),
  worldRotation: React.PropTypes.instanceOf(THREE.Quaternion)
};

export default World;
