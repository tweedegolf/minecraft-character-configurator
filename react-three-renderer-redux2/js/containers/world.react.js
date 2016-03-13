import THREE from 'three'
import React, {Component, PropTypes}from 'react'
import ReactDOM from 'react-dom'
import React3 from 'react-three-renderer'
import {connect} from 'react-redux'


const mapStateToProps = function(state){
  return{
    position: state.worldPosition,
    quaternion: state.worldRotation
  }
}

const mapDispatchToProps = function(dispatch){
  return {
    dispatch
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class World extends Component{

  static displayName = 'World'

  constructor(props){
    super(props)
  }

  render() {
    return (
      <group
        key={'world'}
        quaternion={this.props.quaternion}
      >
        <mesh
          key={'floor'}
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
    )
  }
}

World.propTypes = {
  position: PropTypes.instanceOf(THREE.Vector3),
  quaternion: PropTypes.instanceOf(THREE.Quaternion)
}
