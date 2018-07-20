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
    this.store = props.store
    this._mouseUpListener = this._onMouseUp.bind(this)
    this._orbitControlsHandler = this._onControllerChange.bind(this)
    this._renderTrigger = function(){}
    this._onManualRenderTriggerCreated = (renderTrigger) => {
      this._renderTrigger = renderTrigger
    }
    this.storeInstance = getStore()
    this.onResizeListener = this._onResize.bind(this)
    window.addEventListener('resize', this.onResizeListener)
  }

  _init(autoRender){
    this._canvas.removeEventListener('mouseup', this._mouseUpListener, false)
    this._orbitControls.removeEventListener('change', this._orbitControlsHandler, false)

    if(autoRender === false){
      this._orbitControls.addEventListener('change', this._orbitControlsHandler, false)
      this._renderTrigger()
    }else{
      this._canvas.addEventListener('mouseup', this._mouseUpListener, false)
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return !nextProps.sliderBusy
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.autoRender !== this.props.autoRender){
      this._init(nextProps.autoRender)
    }
  }

  componentDidUpdate(){
  }

  componentDidMount(){
    this._canvas = ReactDOM.findDOMNode(this.refs.react3)
    this._camera = this.refs.camera
    this._orbitControls = new THREE.OrbitControls(this._camera, this._canvas)
    this._init(this.props.autoRender)
  }

  componentWillUnmount(){
    this._orbitControls.removeEventListener('change', this._orbitControlsHandler, false)
    this._canvas.removeEventListener('mouseup', this._mouseUpListener, false)
    this._orbitControls.dispose()
    window.removeEventListener('resize', this.onResizeListener)
  }

  _onResize(e){
    this.props.dispatch(resize({
      width: window.innerWidth,
      height: window.innerHeight
    }))
  }

  _onMouseUp(e){
    this.props.dispatch(updateCamera({
      position: this._camera.position,
      quaternion: this._camera.quaternion
    }))
  }

  _onControllerChange(e){
    this.props.dispatch(updateCamera({
      position: this._camera.position,
      quaternion: this._camera.quaternion
    }))
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
            aspect={window.innerWidth / window.innerHeight}
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
    if(this.props.autoRender === false){
      this._renderTrigger()
    }
    return scene
  }
}

SceneComponent.propTypes = {
  autoRender: PropTypes.bool
}
