import React from 'react'
import {connect} from 'react-redux'
import * as actions from '../actions'
import Controls from '../components/controls.react'
import Stats from '../components/stats.react'
import Scene3D from '../containers/scene.react'
import World from '../containers/world.react'
import Minecraft from '../containers/minecraft.react'


export default class App extends React.Component{

  static displayName = 'App'

  constructor(props){
    super(props)
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render(){
    return(
      <div>
        <Controls/>
        <Scene3D store={this.props.store}>
          <World store={this.props.store}>
            <Minecraft store={this.props.store}/>
          </World>
        </Scene3D>
        <Stats />
      </div>
    )
  }
}

App.propTypes = {}
