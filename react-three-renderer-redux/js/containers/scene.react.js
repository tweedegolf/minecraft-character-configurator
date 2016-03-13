import THREE from 'three'
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import ReactDOM from 'react-dom'
import React3 from 'react-three-renderer'
import {updateCamera, resize} from '../actions'
import OrbitControls from '../../lib/OrbitControls'
import getStore from '../stores/configure_store' // singleton
import World from '../containers/world.react'
import Minecraft from '../containers/minecraft.react'



/* scene graph */
const mapStateToProps = function(state){
  return {
    //store: getStore(),
    sceneWidth: state.sceneWidth,
    sceneHeight: state.sceneHeight,
    cameraPosition: state.cameraPosition,
    cameraQuaternion: state.cameraQuaternion,
    worldPosition: state.worldPosition,
    worldQuaternion: state.worldQuaternion,
    autoRender: state.autoRender
  }
}

const mapDispatchToProps = function(dispatch){
  return {
    dispatch
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SceneComponent extends Component {

  static displayName = 'Scene3D'

  constructor(props) {
    super(props)
    //this.storeInstance = props.store
    this.storeInstance = getStore()
    this.onResizeListener = this._onResize.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState){
    return !nextProps.sliderBusy
  }

  componentDidMount(){
    this._canvas = ReactDOM.findDOMNode(this.refs.react3)
    this._camera = this.refs.camera
    this._orbitControls = new THREE.OrbitControls(this._camera, this._canvas)
    window.addEventListener('resize', this.onResizeListener)
  }

  componentWillUnmount(){
    this._orbitControls.dispose()
    window.removeEventListener('resize', this.onResizeListener)
  }

  _onResize(){
    // let o = resize({
    //   width: window.innerWidth,
    //   height: window.innerHeight
    // })
    // console.log(o, window.innerHeight)
    this.props.dispatch({
      type: 'resize',
      payload: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    })
  }

  render() {
    let scene = (
      <React3
        ref="react3"
        mainCamera="camera"
        width={this.props.sceneWidth}
        height={this.props.sceneHeight}
        antialias
        shadowMapEnabled={true}
        clearColor={0xffffff}
        forceManualRender={!this.props.autoRender}
        onManualRenderTriggerCreated={this._onManualRenderTriggerCreated}
      >
        <scene
          ref="scene"
        >
          <perspectiveCamera
            ref="camera"
            name="camera"
            fov={50}
            aspect={this.props.sceneWidth / this.props.sceneHeight}
            near={1}
            far={1000}
            position={this.props.cameraPosition}
            quaternion={this.props.cameraQuaternion}
          />

          <ambientLight
            color={new THREE.Color(0x333333)}
          />

          <directionalLight
            color={new THREE.Color(0xFFFFFF)}
            intensity={1.5}
            position={new THREE.Vector3(0, 0, 60)}
          />

          <World store={this.storeInstance}>
            <Minecraft store={this.storeInstance}/>
          </World>

        </scene>
      </React3>
    )
    return scene
  }
}

SceneComponent.propTypes = {
  autoRender: PropTypes.bool
}
