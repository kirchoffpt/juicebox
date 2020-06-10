import React, { Component } from 'react';
import { SongList } from './SongList';

export class AudioPlayer extends Component {
  static displayName = "Audio Player";

  constructor(props) {
    super(props);
    this.state = { currentCount: 0, 
      filename: "No File Selected", 
      blob: [], 
      val: "null", 
      downloading : false
    };
    this.promptUserForFile = this.promptUserForFile.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.loadMedia = this.loadMedia.bind(this);
    this.updateSongNames = this.updateSongNames.bind(this);
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
      audioSrc.src = reader.result;
      this.setState({ blob: reader.result, filename: file.name })
      this.uploadMediaFile(file.name, this.state.blob);
      audio.load();
    }).bind(this));
    if (file) {
      reader.readAsDataURL(file)
    }
  }

  async loadMedia(e){
    if(this.state.downloading) return;
    this.setState({ downloading : true })
    var audio = document.getElementById('audio');
    var audioSrc = document.getElementById('audioSrc');
    var filename = document.getElementById('filetoget').value
    const response = await fetch('/mediahandler/downloadmedia?name=' + filename);
    const data = await response.json();
    audioSrc.src = data.blob;
    audio.load();
    this.setState({ downloading : false })
  }

  async updateSongNames() {
    const response = await fetch('mediahandler/getsongnames');
    const data = await response.json();
    this.setState({songNames : data});
  }

  componentDidMount() {
    //load song names
    this.updateSongNames();
  }

  render() {
    let downloadButtonString = this.state.downloading ? "..." : "DOWNLOAD";
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
        <input id="filetoget" type="text" defaultValue="type song to load" />
        <button className="btn btn-primary" onClick={this.loadMedia}>
          {downloadButtonString}
        </button>
        <SongList songNames={this.state.songNames}/>
      </div>
    );
  }

  async uploadMediaFile(filename, blob) {
    const data = { name: filename, blob: blob };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
    const response = await fetch('/mediahandler/uploadmedia', options)
    this.updateSongNames();
  };
}
