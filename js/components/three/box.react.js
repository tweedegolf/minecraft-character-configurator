import THREE from 'three';
import React from 'react';
//import ReactTHREE from 'react-three';
import ReactTHREE from '../../../lib/react-three-commonjs';

let Mesh = ReactTHREE.Mesh;

class Box extends React.Component {

  static displayName = 'Box';

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <Mesh
        key={THREE.Math.generateUUID()}
        geometry={new THREE.BoxGeometry(this.props.size.x, this.props.size.y, this.props.size.z)}
        material={new THREE.MeshBasicMaterial({color: this.props.color})}
        position={new THREE.Vector3(this.props.position.x, this.props.position.y, this.props.position.z)}
      />
    );
  }
}

Box.propTypes = {
  // position: React.PropTypes.instanceOf(THREE.Vector3),
  // quaternion: React.PropTypes.instanceOf(THREE.Quaternion),
  // scale: React.PropTypes.number
};

export default Box;
