import THREE from 'three';
import React, {Component, PropTypes}from 'react';
import React3 from 'react-three-renderer';
import Box from '../components/box.react';
import {init} from '../actions'
import {connect} from 'react-redux';


const mapStateToProps = function(state){
  return{
    position: state.characterPosition,
    quaternion: state.characterRotation,
    scale: new THREE.Vector3(1, 1, 1),
    config: state.config
  }
};

const mapDispatchToProps = function(dispatch){
  return {
    dispatch
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Minecraft extends Component {

  static displayName = 'Minecraft'

  constructor(props) {
    super(props);
  }

  componentDidMount(){
  }

  render() {
    let config = this.props.config;

    if(typeof config === 'undefined'){
      return (<group key={'placeholder'}></group>)
    }

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
  config: PropTypes.instanceOf(Object),
  position: PropTypes.instanceOf(THREE.Vector3),
  quaternion: PropTypes.instanceOf(THREE.Quaternion),
  scale: PropTypes.instanceOf(THREE.Vector3)
};
