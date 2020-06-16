import React, { Component } from 'react';
import { SongList } from './SongList';
import Slider from '@material-ui/core/Slider';

export class AudioPlayer extends Component {
  static displayName = "Audio Player";

  constructor(props) {
    super(props);
    this.state = { currentCount: 0, 
      filename: "No File Selected", 
      dataurl: "",
      uploadingSongNames : [],
      progress : 0,
      progressStart : 0,
    };
    this.promptUserForFile = this.promptUserForFile.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.loadMedia = this.loadMedia.bind(this);
    this.updateSongNames = this.updateSongNames.bind(this);
    this.uploadMediaFile = this.uploadMediaFile.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleSeek = this.handleSeek.bind(this);
    this.audioElement = new Audio();
    this.dragging = false;
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
      this.uploadMediaFile(file);
    }
  }

  async uploadMediaFile(file) {
    var formData = new FormData();
    var uploadingSongNames = this.state.uploadingSongNames;
    uploadingSongNames.push(file.name);

    formData.append('file',file);
    formData.append('name',file.name);
    this.setState({uploadingSongNames});
    const options = {
      method: 'POST',
      body: formData,
    }
    //const response?
    await fetch('/mediahandler/uploadmedia', options);

    uploadingSongNames = this.state.uploadingSongNames.filter(ele => ele !== file.name);
    this.setState({uploadingSongNames});
    this.updateSongNames();
  };

  loadMedia(e,seek){
    if(!seek) seek = 0;
    //var audioElement = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    //audioElement.play();
    var filename = document.getElementById('filetoget').value;
    this.audioElement.pause();
    this.audioElement.src = 'mediahandler/getsong?name='+filename+'&seek='+seek.toString();
    this.audioElement.currentTime = 500;
    this.audioElement.play();

    this.setState({progressStart : seek })
  }

  async updateSongNames() {
    const response = await fetch('mediahandler/getsongnames');
    const data = await response.json();
    this.setState({songNames : data});
  }

  componentWillUnmount() {
    this.audioElement.pause();
  }

  componentDidMount() {
    //load song names
    this.updateSongNames();
    this.audioElement.volume = 0.08;
    this.audioElement.addEventListener('timeupdate', this.handleProgress);
  }

  handleProgress(event) {
    if(this.dragging) return;
    var progress = this.state.progressStart;
    progress = progress+(100-progress)*this.audioElement.currentTime/this.audioElement.duration;
    this.setState({progress});
  }

  handleBarChange = (event, value) => {
    this.dragging = true;
    this.setState({ progress : value })
  }

  handleSeek = (event, value) => {
    this.loadMedia(null,value);
    this.dragging = false;
  }

  render() {
    let uploadingSongNames = "";
    if(this.state.uploadingSongNames.length > 0){
      uploadingSongNames = "uploading: "
      for (var x in this.state.uploadingSongNames){
        uploadingSongNames += this.state.uploadingSongNames[x] + " ";
      }
    }
    return (
      <div>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
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
          UPLOAD
        </button>
        <div className="input-group mb-4">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">♫</span>
          </div>
          <input id="filetoget" type="text" className="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1"/>
          <button className="btn btn-primary" onClick={this.loadMedia}>
            ▶
          </button>
        </div>
        <Slider
          className = "mb-3"
          id="trackbar"
          defaultValue={0}
          value={this.state.progress}
          aria-labelledby="discrete-slider-small-steps"
          step={1}
          min={0}
          max={100}
          valueLabelDisplay="off"
          onChange={this.handleBarChange} 
          onChangeCommitted={this.handleSeek} 
        />
        <SongList songNames={this.state.songNames}/>
        <i>{uploadingSongNames}</i>
      </div>
    );
  }
}

