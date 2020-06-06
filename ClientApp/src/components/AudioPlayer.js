import React, { Component } from 'react';

export class AudioPlayer extends Component {
  static displayName = "Audio Player";

  constructor(props) {
    super(props);
    this.state = { currentCount: 0, filename: "No File Selected", blob: [], val: "null" };
    this.promptUserForFile = this.promptUserForFile.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
  }

  promptUserForFile(e) {
    this.refs.fileUploader.click();
  }

  onChangeFile(e) {
    e.stopPropagation();
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();
    var audio = document.getElementById('audio');
    var audioSrc = document.getElementById('audioSrc');
    reader.addEventListener("load", (function () {
      this.setState({ blob: reader.result, filename: file.name })
      audioSrc.src = reader.result;
      this.uploadMediaFile(file.name, this.state.blob);
      audio.load();
    }).bind(this));
    if (file) {
      reader.readAsDataURL(file)
    }
  }

  render() {
    return (
      <div>
        <h1>AudioPlayer</h1>
        <input type="text" key={this.state.filename} defaultValue={this.state.filename} />
        <button className="btn btn-primary" onClick={this.promptUserForFile}>
          <input
            type="file"
            id="file"
            ref="fileUploader"
            accept="audio/mpeg"
            multiple={true}
            style={{ display: "none" }}
            onChange={this.onChangeFile}
          />
          BROWSE
        </button>
        <audio id="audio" controls="controls">
          <source id="audioSrc" src="" type="audio/mpeg"></source>
        </audio>
        <b>{this.state.val}</b>
      </div>
    );
  }

  async getMedia() {
    console.log("fetching data");
    const response = await fetch('mediahandler');
    const data = await response.json();
    this.setState({ val: data });
  }

  async uploadMediaFile(filename, blob) {
    const data = { medianame: filename, blob: blob };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
    fetch('/mediahandler/uploadmedia', options)
      .then(response => response.json())
      .then(data => console.log(data));
  };
}
