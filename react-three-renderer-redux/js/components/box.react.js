import THREE from 'three'
import React, {Component, PropTypes}from 'react'
import React3 from 'react-three-renderer'

class Box extends Component {

  static displayName = 'Box'

  constructor(props) {
    super(props)
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
    )
  }
}

Box.propTypes = {
  color: PropTypes.number,
  position: PropTypes.instanceOf(Object),
  size: PropTypes.instanceOf(Object)
}

export default Box
