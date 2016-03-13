import React from 'react'
import Controls from '../components/controls.react'
import Stats from '../components/stats.react'
import Scene3D from '../containers/scene.react'
// import World from '../containers/world.react'
// import Minecraft from '../containers/minecraft.react'


export default class App extends React.Component{

  static displayName = 'App'

  constructor(props){
    super(props)
  }

  render(){
    return(
      <div>
        <Controls/>
        <Scene3D/>
        <Stats/>
      </div>
    )
  }
/*
  render(){
    return(
      <div>
        <Controls/>
        <Scene3D>
          <World store={this.props.store}>
            <Minecraft store={this.props.store}/>
          </World>
        </Scene3D>
        <Stats/>
      </div>
    )
  }
*/
}

App.propTypes = {}
