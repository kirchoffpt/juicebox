import React, { Component } from 'react';
import { SongList } from './SongList';

export class AudioPlayer extends Component {
  static displayName = "Audio Player";

  constructor(props) {
    super(props);
    this.state = { currentCount: 0, 
      filename: "No File Selected", 
      datacache: "", 
      downloading : false,
      uploadingSongNames : [],
      progress : 0
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
        reader.onload = (function(e){
            this.setState({ filename: file.name })
            this.uploadMediaFile(file.name, e.target.result);
            resolve(e.target.result);
        }).bind(this);
        reader.onerror = function(err) {
            console.error("Failed to read", file.name, "due to", err);
            reject(err);
        };
        reader.readAsDataURL(file);
    }).bind(this));
}


  //https://dev.mysql.com/doc/connector-net/en/connector-net-programming-blob-reading.html

  async loadMedia(e){
    if(this.state.downloading) return;
    this.setState({ downloading : true });

    var filename = document.getElementById('filetoget').value;
    const sizeResponse = await fetch('/mediahandler/getcolumnfromname?name=' + filename + '&column=size');
    const sizeData = await sizeResponse.json();
    const fileSize = sizeData[0];
    var audio = document.getElementById('audio');
    var chunkSize = 1000;
    var idx = 1;
    var progress = 0;
    this.setState({progress, datacache : ""});
    do{
      var response = await fetch('/mediahandler/downloadmediachunk?name=' + filename + '&idx=' + idx.toString() + '&size=' + chunkSize.toString());
      var data = await response.json();
      idx += chunkSize;
      progress = Math.min(100,Math.round(100*idx/fileSize));
      this.setState({progress, datacache : this.state.datacache + data[0]});
      chunkSize = Math.min(chunkSize*2,2E6);
    }while(data[0] !== null && data[0].length > 0);
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
        <button className="btn btn-primary mb-3" onClick={this.promptUserForFile}>
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
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">♫</span>
          </div>
          <input id="filetoget" type="text" className="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1"/>
          <button className="btn btn-primary" onClick={this.loadMedia}>
           {downloadButtonString}
          </button>
        </div>
        <div className="progress mb-3">
          <div className="progress-bar" id="loadbar" role="progressbar" style={{width : this.state.progress.toString() + "%"}} aria-valuenow={this.state.progress.toString()} aria-valuemin="0" aria-valuemax="100">
            {this.state.progress.toString()+"%"}
          </div>
        </div>
        <SongList songNames={this.state.songNames}/>
        <i>{uploadingSongNames}</i>
        <audio className="mb-3" autoPlay={false} src={this.state.datacache} id="audio" controls="controls">
          
        </audio>
      </div>
    );
  }

  async uploadMediaFile(filename, blob) {
    const data = { name: filename, blob: blob, size : blob.length};
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

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
