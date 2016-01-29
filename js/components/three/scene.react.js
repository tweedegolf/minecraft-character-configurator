import THREE from 'three';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTHREE from 'react-three';
import SettingsAction from '../../actions/settings_action';
import OrbitControls from '../../../lib/OrbitControls';


let Scene = ReactTHREE.Scene;
let Camera = ReactTHREE.PerspectiveCamera;
let AmbientLight = ReactTHREE.AmbientLight;
let DirectionalLight = ReactTHREE.DirectionalLight;

/* scene graph */

class SceneComponent extends React.Component {

  static displayName = 'Scene3D';

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState){
    return !nextProps.sliderBusy;
  }

  componentWillReceiveProps(){
  }

  componentDidMount(){
    let canvas = ReactDOM.findDOMNode(this.refs.scene);
    let camera = this.refs.camera;
    this._orbitControls = new THREE.OrbitControls(camera, canvas);
    this._orbitControls.addEventListener('change', this._onControllerChange, false);
  }

  componentWillUnmount(){
    this._orbitControls.removeEventListener('change', this._onControllerChange, false);
  }

  _onControllerChange(e){
    SettingsAction.updateCamera({
      position: e.target.lastPosition,
      quaternion: e.target.lastQuaternion
    });
  }

  render() {
    let scene = (
      <Scene
        ref="scene"
        width={window.innerWidth}
        height={window.innerHeight}
        camera={'camera'}
        antialias={true}
        autoClear={true}
        transparent={true}
        shadowMapEnabled={true}
        shadowMapSoft={true}
        enableRapidRender={false}
        background={0xffffff}
      >
        <Camera
          ref="camera"
          aspect={window.innerWidth / window.innerHeight}
          far={1000}
          fov={50}
          lookat={new THREE.Vector3(0, 0, 0)}
          name={'camera'}
          near={1}
          position={this.props.cameraPosition}
          quaternion={this.props.cameraQuaternion}
        />
        <AmbientLight
          color={new THREE.Color(0x333333)}
          intensity={0.5}
          target={new THREE.Vector3(0, 0, 0)}
        />
        <DirectionalLight
          color={new THREE.Color(0xFFFFFF)}
          intensity={1.5}
          position={new THREE.Vector3(0, 0, 60)}
        />
        {this.props.children}
      </Scene>
    );
    return scene;
  }
}

SceneComponent.propTypes = {
  sceneRotation: React.PropTypes.instanceOf(THREE.Quaterion)
};

export default SceneComponent;
