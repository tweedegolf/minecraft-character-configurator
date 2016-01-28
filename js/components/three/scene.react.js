import THREE from 'three';
import React from 'react';
import ReactDOM from 'react-dom';
//import ReactTHREE from 'react-three';
import ReactTHREE from '../../../lib/react-three-commonjs';
import SettingsAction from '../../actions/settings_action';
import OrbitControls from '../../../lib/OrbitControls';
import World from './world.react';
import Minecraft from './minecraft.react';


let Scene = ReactTHREE.Scene;
let Camera = ReactTHREE.PerspectiveCamera;
let AmbientLight = ReactTHREE.AmbientLight;
let DirectionalLight = ReactTHREE.DirectionalLight;

/* scene graph */

class SceneComponent extends React.Component {

  static displayName = 'Scene3D';

  constructor(props) {
    super(props);
    this._cameraPosition = this.props.cameraPosition;
    this._cameraQuaternion = this.props.cameraQuaternion;
  }

  shouldComponentUpdate(nextProps, nextState){
    return !nextProps.sliderBusy;
  }

  componentWillReceiveProps(){
  }

  componentDidMount(){
    this._canvas = ReactDOM.findDOMNode(this.refs.scene);
    this._canvasListener = () => {
      SettingsAction.updateCamera({
        position: this._cameraPosition,
        quaternion: this._cameraQuaternion
      });
    };
    this._canvas.addEventListener('mouseup', this._canvasListener, false);
  }

  componentWillUnmount(){
    this._canvas.removeEventListener('mouseup', this._canvasListener, false);
  }

  _onControllerChange(e){
    this._cameraPosition = e.target.lastPosition;
    this._cameraQuaternion = e.target.lastQuaternion;
  }

  render() {
    let scene = (
      <Scene
        //key={THREE.Math.generateUUID()}
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
        orbitControls={THREE.OrbitControls}
        background={0xffffff}
        onControllerChange = {this._onControllerChange.bind(this)}
      >
        <Camera
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
