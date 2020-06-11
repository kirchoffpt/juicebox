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
      downloading : false,
      uploadingSongNames : []
    };
    this.promptUserForFile = this.promptUserForFile.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.loadMedia = this.loadMedia.bind(this);
    this.updateSongNames = this.updateSongNames.bind(this);
    this.readFile = this.readFile.bind(this);
  }

  promptUserForFile(e) {
    this.refs.fileUploader.click();
  }

  onChangeFile(e) {
    e.stopPropagation();
    e.preventDefault();
    for(let i = 0; i < e.target.files.length; i++){
      var file = e.target.files[i];
      //var pureName = file.name.replace(/\.[^/\\.]+$/, "");
      this.readFile(file);
    }
  }

  readFile(file){
    return new Promise((function(resolve, reject){
        var reader = new FileReader();
        reader.onload = (function(evt){
            //console.log("Just read", file.name);
            this.setState({ filename: file.name })
            this.uploadMediaFile(file.name, evt.target.result);
            resolve(evt.target.result);
        }).bind(this);
        reader.onerror = function(err) {
            console.error("Failed to read", file.name, "due to", err);
            reject(err);
        };
        reader.readAsDataURL(file);
        // Would be sweet if readAsDataURL already returned a promise
    }).bind(this));
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
    let uploadingSongNames = "";
    if(this.state.uploadingSongNames.length > 0){
      uploadingSongNames = "uploading: "
      for (var x in this.state.uploadingSongNames){
        uploadingSongNames += this.state.uploadingSongNames[x] + " ";
      }
    }
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
        <input id="filetoget" type="text" defaultValue="type song to load" />
        <button className="btn btn-primary" onClick={this.loadMedia}>
          {downloadButtonString}
        </button>
        <SongList songNames={this.state.songNames}/>
        <i>{uploadingSongNames}</i>
      </div>
    );
  }

  async uploadMediaFile(filename, blob) {
    const data = { name: filename, blob: blob };
    var uploadingSongNames = this.state.uploadingSongNames;
    uploadingSongNames.push(filename);
    this.setState({uploadingSongNames});
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
    const response = await fetch('/mediahandler/uploadmedia', options);
    uploadingSongNames = this.state.uploadingSongNames.filter(ele => ele !== filename);
    this.setState({uploadingSongNames});
    this.updateSongNames();
  };
}
