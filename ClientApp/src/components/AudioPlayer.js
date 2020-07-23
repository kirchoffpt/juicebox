import React, { Component } from 'react';
import { SongList } from './SongList';
import { UserList } from './UserList';
import { Visualizer } from './Visualizer';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Drawer, CircularProgress, Slider } from '@material-ui/core';

export class AudioPlayer extends Component {
  static displayName = "Audio Player";

  constructor(props) {
    super(props);
    this.state = {
      playBtnToggle : false,
      playingfile : "",
      uploadingSongNames : [],
      progress : 0,
      users : {},
      drawer : false,
    };
    this.promptUserForFile = this.promptUserForFile.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.updateSongNames = this.updateSongNames.bind(this);
    this.uploadMediaFile = this.uploadMediaFile.bind(this);
    this.initUsers = this.initUsers.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.nextTrack = this.nextTrack.bind(this);
    this.handleSeek = this.handleSeek.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.copyURL = this.copyURL.bind(this);
    this.setCurrSong = this.setCurrSong.bind(this);
    this.setVolume = this.setVolume.bind(this);
    this.toggleUserDrawer = this.toggleUserDrawer.bind(this);
    this.getFrequencyBandData = this.getFrequencyBandData.bind(this);

    this.audioElement = new Audio();

    //visualizer stuff
    this.audioContext = new AudioContext();
    this.audioSource = this.audioContext.createMediaElementSource(this.audioElement);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.85;
    this.audioSource.connect(this.audioContext.destination);
    this.audioSource.connect(this.analyser);
    this.amplArray = new Uint8Array(this.analyser.frequencyBinCount);
    
    this.dragging = false;
    this.initialVolumeBarVal = 0.5;
    this.playing = this.state.playBtnToggle; //some of these are out of state to make sure they are dealt with synchronously
    console.log(this.props.userName);
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
    formData.append('roomId', this.props.roomID);
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
    this.alertNewSongList();
  };

  setCurrSong(songname){
    var seek = 0;
    if(this.state.playingfile === songname){
      return;
    }
    this.audioElement.src = 'mediahandler/getsongstream?name='+songname+"&roomid="+this.props.roomID;
    if(this.playing) this.audioElement.play();
    document.getElementById("filetoget").value = songname;
    this.setState({progress : 0, playingfile : songname});
  }

  togglePlay(e, seek){
    if(this.playing){
      this.audioElement.pause();
    } else {
      this.audioElement.play();
      this.audioContext.resume();
    }
    this.playing = !this.playing;
    this.setState({playBtnToggle : !this.state.playBtnToggle});
  }

  setVolume(event, volume){
    var v = volume;
    if(v > 0) v = 1*Math.exp(6*(v-1));
    v = Math.max(v,0);
    v = Math.min(v,1);
    this.audioElement.volume = v;
  }

  async updateSongNames() {
    const response = await fetch('mediahandler/getsongnames?roomid='+this.props.roomID);
    const data = await response.json();
    this.setState({songNames : data});
  }

  async initUsers() {
    const response = await fetch('userhandler/getotherusers?thisuser=' + this.props.userName + "&roomid=" + this.props.roomID);
    const data = await response.json();
    var users = this.state.users;
    for (var user in data) {
      users[data[user]] = {songname : null, seekloc : 0};
    }
    this.setState({users});
  }

  componentWillUnmount() {
    this.stopConnection();
    this.audioElement.pause();
  }

  handleProgress(event) {
    if(this.dragging) return;
    var progress = 1000*this.audioElement.currentTime/this.audioElement.duration;

    if(progress) this.setState({progress});
  }

  getFrequencyBandData(){
    this.analyser.getByteFrequencyData(this.amplArray);
    return this.amplArray;
  }


  nextTrack(event) {
    var songnames = this.state.songNames;
    var idx = songnames.indexOf(this.state.playingfile);
    idx = idx + 1;
    if(idx >= songnames.length) idx = 0;
    var nextSong = songnames[idx];
    this.setCurrSong(nextSong);
  }

  handleBarChange = (event, value) => {
    this.dragging = true;
    this.setState({ progress : value })
  }

  handleSeek = (event, seek) => {
    seek = Math.round(seek);
    if(!this.state.playingfile) return;
    //this.audioElement.pause();
    if(seek < 1000) {
      //this.audioElement.src = 'mediahandler/getsong?name='+this.state.playingfile+'&seek='+seek.toString()+"&roomid="+this.props.roomID;
      this.audioElement.currentTime = this.audioElement.duration*seek/1000;
      if(this.playing) this.audioElement.play();
      this.setState({progress : seek})
    } else {
      this.audioElement.pause()
      this.nextTrack();
    }
    this.dragging = false;
  }

  copyURL(event){
    var linkURL = window.location.href;
    navigator.clipboard.writeText(linkURL).then(function() {
      alert("Copied '" + linkURL + "' to clipboard!");
    }, function() {
      alert("Copy failed. Please simply share the link in your browser to invite others.");
    });
  }

  toggleUserDrawer(event){
    this.setState({drawer : !this.state.drawer});
  }

  render() {
    let uploadingSongNames = "";
    if(this.state.uploadingSongNames.length > 0){
      uploadingSongNames = "uploading: "
      for (var x in this.state.uploadingSongNames){
        uploadingSongNames += this.state.uploadingSongNames[x] + " ";
      }
    }
    var playBtnTxt = this.state.playBtnToggle ? "STOP" : "PLAY"; 
    return (
      <div>
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
        {/* <button className="btn btn-primary mb-3 ml-3" onClick={this.copyURL}>
          INVITE
        </button> */}
        <button className="btn btn-primary mb-3 ml-3" onClick={this.toggleUserDrawer}>
          USERS
        </button>
        <Slider
          style = {{width : "20%", minWidth : "100px"}}
          className = "float-right mt-1"
          id = "volumebar"
          defaultValue={this.initialVolumeBarVal}
          aria-labelledby="discrete-slider-small-steps"
          step={0.01}
          min={0}
          max={1}
          valueLabelDisplay="off"
          onChange={this.setVolume}
        />
        <Visualizer className="mb-1" getFrequencyData={this.getFrequencyBandData}></Visualizer>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">♫</span>
          </div>
          <input id="filetoget" type="text" className="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1"/>
          <button className="btn btn-primary" onClick={this.togglePlay}>
            {playBtnTxt}
          </button>
        </div>
        <Slider
          className = "mb-2"
          id="trackbar"
          defaultValue={0}
          value={this.state.progress}
          aria-labelledby="discrete-slider-small-steps"
          step={1}
          min={0}
          max={1000}
          valueLabelDisplay="off"
          onChange={this.handleBarChange} 
          onChangeCommitted={this.handleSeek} 
        />
        <SongList activeSong={this.state.playingfile} songNames={this.state.songNames} users={this.state.users} setCurrSong={this.setCurrSong}/>
        <UploadingInfo uploadingSongNames={uploadingSongNames}/>
        <Drawer
        anchor="left"
        open={this.state.drawer}
        onClose={this.toggleUserDrawer}
        >
          <div className="container darktheme fullheight" style={{padding : 20, paddingTop : 10}}>
            <h6 
                style={{
                  color : "#606060",
                  fontSize : "200%",
                  fontWeight : "500",
                }}> {this.props.roomID.toUpperCase()}
            </h6>
            <UserList roomId={this.props.roomID} userName={this.props.userName} songNames={this.state.songNames} users={this.state.users}/>
          </div>
        </Drawer>
      </div>
    );
  }

  componentDidMount() {
    //load song names
    this.updateSongNames();
    this.setVolume(null, this.initialVolumeBarVal);
    this.audioElement.addEventListener('timeupdate', this.handleProgress);
    this.audioElement.addEventListener('ended', this.nextTrack);

    //websocketstuff
    var connection = new HubConnectionBuilder().withUrl("/datahub").build();
    this.stopConnection = function (){connection.stop()};
    this.alertNewSongList = function(){connection.invoke("NewSongList", this.props.roomID)};

    connection.on("ReceiveMessage", (function (songname, seekloc, username) {
        var users = this.state.users;
        users[username] = {songname, seekloc};
        this.setState({users});
    }).bind(this));

    connection.on("RemoveUserFromClient", (function (username) {
      var users = this.state.users;
      delete users[username];
      this.setState({users});
    }).bind(this));

    connection.on("UpdateSongList", (function () {
      this.updateSongNames();
    }).bind(this));

    var roomID = this.props.roomID;
    var u = this.props.userName
    connection.start().then(function () {
      connection.invoke("JoinRoom", u, roomID);
      connection.invoke("SendMessage", null, 0, roomID, u);
    }).catch(function (err) {
        return console.error(err.toString());
    })

    this.audioElement.addEventListener('timeupdate', (function (event) {
        connection.invoke("SendMessage", this.state.playingfile, Math.round(this.state.progress), this.props.roomID, this.props.userName).catch(function (err) {
            return console.error(err.toString() + 'in timeupdate');
        });
        event.preventDefault();
    }).bind(this));

    this.initUsers();
  }
}


class UploadingInfo extends Component {
  static displayName = "Uploading Info";
  constructor(props) {
    super(props);
    this.state = {};
  }
  render(){

    if (this.props.uploadingSongNames.length <= 0) return null;
    
    return(
      <div className="container">
        <div className="row">
        <i>{this.props.uploadingSongNames}</i>
        </div>
        <div className="row">
        <CircularProgress color="inherit" className="mt-3" />
        </div>
      </div>
    );
  }
}

