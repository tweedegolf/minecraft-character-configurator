import THREE from 'three';
import React from 'react';
import React3 from 'react-three-renderer';

class Box extends React.Component {

  static displayName = 'Box';

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <mesh
        key={THREE.Math.generateUUID()}
        position={new THREE.Vector3(this.props.position.x, this.props.position.y, this.props.position.z)}
      >
        <boxGeometry
          width={this.props.size.x}
          height={this.props.size.y}
          depth={this.props.size.z}
        />
        <meshBasicMaterial
          color={this.props.color}
        />
      </mesh>
    );
  }
}

Box.propTypes = {
  color: React.PropTypes.number,
  position: React.PropTypes.instanceOf(Object),
  size: React.PropTypes.instanceOf(Object)
};

export default Box;
