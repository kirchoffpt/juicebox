import React, { Component } from 'react';
import axios from 'axios';

export class Counter extends Component {
  static displayName = Counter.name;

  constructor(props) {
    super(props);
    this.state = { currentCount: 0, filenames : "nofileselected", binary : null};
    this.promptUserForFile = this.promptUserForFile.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
  }

  promptUserForFile(e) {
    this.refs.fileUploader.click();
    this.setState({
      currentCount: this.state.currentCount + 1
    });
  }

  onChangeFile(e) {
    e.stopPropagation();
    e.preventDefault();
    var file = e.target.files[0];

    var reader = new FileReader();
    reader.onload = (function(event) {
      this.setState({audiosrc : event.target.result.toString(), filenames : file.name});
    }).bind(this);
    reader.readAsDataURL(file);
  }

  update(){
    this.forceUpdate();
    console.log(this.state);
    console.log(document.getElementById('audio'));
  }

  render() {

    console.log("RENDERING!");
    return (
      <div>
        <h1>Counter</h1>

        <p>This is a simple example of a React component.</p>

        <p aria-live="polite">Current count: <strong>{this.state.currentCount}</strong></p>
      
        <input type="text" key={this.state.filenames} defaultValue={this.state.filenames}/>
        <button className="btn btn-primary" onClick={this.promptUserForFile}>
          <input 
          type="file" 
          id="file" 
          ref="fileUploader" 
          accept="audio/mpeg" 
          multiple={true} 
          style={{display: "none"}}
          onChange={this.onChangeFile}
          />
          BROWSE
        </button>
        <button className="btn btn-primary" onClick={this.update.bind(this)}>
          UPDATE
        </button>
        <audio controls>
          <source src={this.state.audiosrc} key={this.state.audiosrc} id="audio" type="audio/mpeg"></source>
        </audio>
      </div>
    );
  }
}
