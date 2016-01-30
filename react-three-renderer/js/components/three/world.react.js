import THREE from 'three';
import React from 'react';
import React3 from 'react-three-renderer';

class World extends React.Component{

  static displayName = 'World';

  constructor(props){
    super(props);
  }

  render() {
    return (
      <group
        key={'world'}
        quaternion={this.props.worldRotation}
      >
        <mesh
          key={'floor'}
          //key={THREE.Math.generateUUID()} // the key has to be unique otherwise it won't render after an update, I think this is weird
          position={this.props.position}
        >
          <planeBufferGeometry
            width={300}
            height={300}
            widthSegments={30}
            heightSegments={30}
          />
          <meshBasicMaterial
            opacity={0.5}
            color={0x333000}
            side={THREE.DoubleSide}
            wireframe
          />
        </mesh>
        {this.props.children}
      </group>
    );
  }
}

World.propTypes = {
  position: React.PropTypes.instanceOf(THREE.Vector3),
  worldRotation: React.PropTypes.instanceOf(THREE.Quaternion)
};

export default World;
