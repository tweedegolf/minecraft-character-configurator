import THREE from 'three';
import React from 'react';
import ReactTHREE from 'react-three';

let Mesh = ReactTHREE.Mesh;

class Box extends React.Component {

  static displayName = 'Box';

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <Mesh
        geometry={new THREE.BoxGeometry(this.props.size.x, this.props.size.y, this.props.size.z)}
        key={THREE.Math.generateUUID()}
        material={new THREE.MeshBasicMaterial({color: this.props.color})}
        position={new THREE.Vector3(this.props.position.x, this.props.position.y, this.props.position.z)}
      />
    );
  }
}

Box.propTypes = {
  color: React.PropTypes.number,
  position: React.PropTypes.instanceOf(Object),
  size: React.PropTypes.instanceOf(Object)
};

export default Box;
