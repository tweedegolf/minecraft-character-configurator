import THREE from 'three';
import React from 'react';
import SettingsStore from '../stores/settings_store';
import Scene3D from './three/scene.react';
import Minecraft from './three/minecraft.react';
import World from './three/world.react';
import Controls from './controls.react';

/* main react component, the only component with state */

class App extends React.Component{

  static displayName = 'App';

  constructor(props){
    super(props);
    this.state = {};
    this.state = SettingsStore.getSettings();
    this.onChangeListener = this.onChange.bind(this);
  }

  componentDidMount() {
    SettingsStore.addChangeListener(this.onChangeListener);
    window.addEventListener('resize', this.onChangeListener);
  }

  componentWillUnmount() {
    SettingsStore.removeChangeListener(this.onChangeListener);
    window.removeEventListener('resize', this.onChangeListener);
  }

  onChange(){
    let state = SettingsStore.getSettings();
    this.setState(state);
  }

  render(){
    return(
      <div>
        <Controls
          headSize={this.state.headSize}
          armLength={this.state.armLength}
          legLength={this.state.legLength}
        />
        <Scene3D
          //worldRotation={this.state.worldRotation}
          sliderBusy={this.state.sliderBusy}
        >
          <World
            position={new THREE.Vector3(0, 0, 0)}
          >
            <Minecraft
              position={new THREE.Vector3(0, 0, 0)}
              //quaternion={new THREE.Quaternion()}
              scale={1}
              config={this.state.config}
            />
          </World>
        </Scene3D>
      </div>
    );
  }
}

App.propTypes = {};


export default App;

