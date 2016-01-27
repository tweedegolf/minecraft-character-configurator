import React from 'react';

class UploadButton extends React.Component{

  static displayName = 'UploadButton';

  constructor(props){
    super(props);

    if(this.props.onDragAndDrop){

      document.addEventListener('dragover', function(e){
        e.preventDefault();
      }, false);

      document.addEventListener('dragenter', function(e){
        e.preventDefault();
      }, false);

      document.addEventListener('dragleave', function(e){
        e.preventDefault();
      }, false);

      document.addEventListener('drop', (e) => {
        e.preventDefault();
        this.props.onDragAndDrop(e);
      }, false);
    }
  }

  render(){
    return(
      <div>
        <span>{this.props.label}</span><input type="button" value={this.props.buttonLabel} onClick={() => this.refs.uploadButton.click()}></input>
        <input ref="uploadButton" className="hidden" type="file" multiple="multiple" onChange={this.props.onBrowse}/>
      </div>
    );
  }
}

UploadButton.propTypes = {
  buttonLabel: React.PropTypes.string,
  onBrowse: React.PropTypes.function,
  onDragAndDrop: React.PropTypes.function
};

export default UploadButton;
