import THREE from 'three';
import React from 'react';
//import ReactTHREE from 'react-three';
import ReactTHREE from '../../../lib/react-three-commonjs';
import Globals from '../../globals';
import Minecraft from './minecraft.react';


let Object3D = ReactTHREE.Object3D;
let Mesh = ReactTHREE.Mesh;

class World extends React.Component{

  static displayName = 'World';

  constructor(props){
    super(props);
    this.geometry = new THREE.PlaneBufferGeometry(300, 300, 30, 30);
    this.material = new THREE.MeshBasicMaterial({opacity: 0.5, color: 0x333000, side: THREE.DoubleSide, wireframe: true});
    this.worldRotation = Globals.WORLD_ROTATION;
  }

  render() {

    console.log('world', this.props.children);

    let w = (
      <Object3D quaternion={this.worldRotation}>
        <Mesh
          geometry={this.geometry}
          material={this.material}
          position={this.props.position}
        >
          {this.props.children}
        </Mesh>
      </Object3D>
    );
    //console.log(w);
    return w;
  }
}

World.propTypes = {
};

export default World;
