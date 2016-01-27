import React from 'react';
//import ReactTHREE from 'react-three';
import ReactTHREE from '../../../lib/react-three-commonjs';
import THREE from 'three';

let Mesh = ReactTHREE.Mesh;
let Object3D = ReactTHREE.Object3D;

class Model3D extends React.Component {

  static displayName = 'Model3D';

  constructor(props) {
    super(props);
  }


  render() {

    if(typeof this.props.model === 'undefined'){
      let size = 50;
      this.props.position.z = (size / 2) * this.props.scale;
      return (
        <Mesh
          geometry={new THREE.BoxGeometry(size, size, size)}
          key={THREE.Math.generateUUID()}
          material={new THREE.MeshBasicMaterial({color: 0xcc0000})}
          position={this.props.position}
          scale={this.props.scale}
        />
      );
    }

    // render model with merged geometries
    if(this.props.model.merge){
      let geometry = this.props.model.mergedGeometry;
      let material = this.props.model.material;
      return(
        <Mesh
          geometry={geometry}
          key={THREE.Math.generateUUID()}
          material={material}
          position={this.props.position}
          scale={this.props.scale}
        />
      );
    }


    // render model with separate geometries
    let children = [];
    let geometries = this.props.model.geometries;
    let materialsArray = this.props.model.materialsArray;
    let materialIndices = this.props.model.materialIndices;

    geometries.forEach((geometry, uuid) => {
      let material = materialsArray[materialIndices.get(uuid)];
      //console.log(materialIndices.get(uuid), material);
      children.push(
        <Mesh
          key={uuid}
          geometry={geometry}
          material={material}
        />
      );
    });

    return (
      <Object3D
        key={THREE.Math.generateUUID()}
        quaternion={this.props.model.quaternion}
        position={this.props.position}
        scale={this.props.scale}
      >
        {children}
      </Object3D>
    );
  }
}


Model3D.propTypes = {
  model: React.PropTypes.object,
  position: React.PropTypes.instanceOf(THREE.Vector3),
  quaternion: React.PropTypes.instanceOf(THREE.Quaternion),
  scale: React.PropTypes.number
};

export default Model3D;
