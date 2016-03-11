import React from 'react'
import {connect} from 'react-redux'
import * as actions from '../actions'
import Controls from '../components/controls.react'
import Stats from '../components/stats.react'
import Scene3D from '../components/scene.react'
import World from '../components/world.react'
import Minecraft from '../components/minecraft.react'


class App extends React.Component{

  static displayName = 'App';

  constructor(props){
    super(props)
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  render(){
    return(
      <div>
        <Controls/>
        <Scene3D store={this.props.store}/>
        <Stats/>
      </div>
    )
  }
  // render(){
  //   return(
  //     <div>
  //       <Controls/>
  //       <Scene3D>
  //         <World>
  //           <Minecraft/>
  //         </World>
  //       </Scene3D>
  //       <Stats />
  //     </div>
  //   )
  // }
}

App.propTypes = {}


// const mapStateToProps = function(state){
//   return state
// }

// const mapDispatchToProps = function(dispatch){
//   return {
//     dispatch
//   }
// }

// export default connect(
//  mapStateToProps,
//  mapDispatchToProps
// )(App)

export default App
