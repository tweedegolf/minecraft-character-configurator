import React from 'react';
//import ReactTHREE from 'react-three';
import ReactTHREE from '../../../lib/react-three-commonjs';
import THREE from 'three';
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
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   return !nextProps.sliderBusy;
  // }

  componentWillReceiveProps(){
  }

  _onControllerChange(e){
    console.log(e);
  }

  render() {
    //console.log('Threejs render scene');

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
        orbitControls={THREE.OrbitControls}
        background={0xffffff}
        onControllerChange = {this._onControllerChange}
      >
        <Camera
          aspect={window.innerWidth / window.innerHeight}
          far={1000}
          fov={50}
          lookat={new THREE.Vector3(0, 0, 0)}
          name={'camera'}
          near={1}
          position={new THREE.Vector3(0, 300, 500)}
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
    //console.log(this.refs.scene);
    return scene;
  }
}

SceneComponent.propTypes = {
  sceneRotation: React.PropTypes.instanceOf(THREE.Quaterion)
};

export default SceneComponent;
