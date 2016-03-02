import React from 'react';
import Stats from '../../lib/stats.min';

/* React wrapper for Threejs framerate counter library */

class StatsComponent extends React.Component{

  static displayName = 'Stats';

  constructor(props){
    super(props);
    this.stats = new Stats();
    this.doUpdate = true;
  }

  componentDidMount(){
    this.update.call(this);
  }

  componentWillUnmount(){
    this.doUpdate = false;
  }

  update(){
    this.stats.update();
    if(this.doUpdate){
      requestAnimationFrame(() => this.update());
    }
  }

  render(){
    document.body.appendChild(this.stats.domElement);
    return false;
  }
}

export default StatsComponent;
