import THREE from 'three';
import React from 'react';
import React3 from 'react-three-renderer';
import Box from './box.react';

class Minecraft extends React.Component {

  static displayName = 'Minecraft';

  constructor(props) {
    super(props);
  }

  componentDidMount(){
  }

  render() {
    let config = this.props.config;

    return (
      <group
        key={'character'}
        position={this.props.position}
        quaternion={this.props.quaternion}
        scale={this.props.scale}
      >
        <Box
          key={'head'}
          size={config.head.size}
          color={config.head.color}
          position={config.head.position}
        />
        <Box
          key={'body'}
          size={config.body.size}
          color={config.body.color}
          position={config.body.position}
        />
        <Box
          key={'leftLeg'}
          size={config.leftLeg.size}
          color={config.leftLeg.color}
          position={config.leftLeg.position}
        />
        <Box
          key={'rightLeg'}
          size={config.rightLeg.size}
          color={config.rightLeg.color}
          position={config.rightLeg.position}
        />
        <Box
          key={'leftArm'}
          size={config.leftArm.size}
          color={config.leftArm.color}
          position={config.leftArm.position}
        />
        <Box
          key={'rightArm'}
          size={config.rightArm.size}
          color={config.rightArm.color}
          position={config.rightArm.position}
        />
      </group>
    );
  }
}

Minecraft.propTypes = {
  config: React.PropTypes.instanceOf(Object),
  position: React.PropTypes.instanceOf(THREE.Vector3),
  quaternion: React.PropTypes.instanceOf(THREE.Quaternion),
  scale: React.PropTypes.instanceOf(THREE.Vector3)
};

export default Minecraft;
