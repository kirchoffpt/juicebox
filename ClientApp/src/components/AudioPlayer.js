import React, { Component } from 'react';
import { Navbar } from 'reactstrap';
import { SongList } from './SongList';
import { UserList} from './UserList';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Drawer, CircularProgress, Slider } from '@material-ui/core';

export class AudioPlayer extends Component {
  static displayName = "Audio Player";

  constructor(props) {
    super(props);
    this.state = {
      filename: "No File Selected", 
      uploadingSongNames : [],
      progress : 0,
      progressStart : 0,
      users : {},
      drawer : false,
    };
    this.promptUserForFile = this.promptUserForFile.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.loadMedia = this.loadMedia.bind(this);
    this.updateSongNames = this.updateSongNames.bind(this);
    this.uploadMediaFile = this.uploadMediaFile.bind(this);
    this.initUsers = this.initUsers.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleSeek = this.handleSeek.bind(this);
    this.copyURL = this.copyURL.bind(this);
    this.toggleUserDrawer = this.toggleUserDrawer.bind(this);
    this.audioElement = new Audio();
    this.dragging = false;
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

  loadMedia(e,seek){
    if(!seek) seek = this.state.progress;
    seek = Math.round(seek);
    var filename = document.getElementById('filetoget').value;
    if(!filename) return;
    //this.audioElement.pause();
    if(seek < 1000) {
      this.audioElement.src = 'mediahandler/getsong?name='+filename+'&seek='+seek.toString();
      this.audioElement.play();
    } else {
      this.audioElement.pause();
    }

    this.setState({progressStart : seek, filename})
  }

  async updateSongNames() {
    const response = await fetch('mediahandler/getsongnames');
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

  componentDidMount() {
    //load song names
    this.updateSongNames();
    this.audioElement.volume = 0.08;
    this.audioElement.addEventListener('timeupdate', this.handleProgress);

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
        connection.invoke("SendMessage", this.state.filename, Math.round(this.state.progress), this.props.roomID, this.props.userName).catch(function (err) {
            return console.error(err.toString());
        });
        event.preventDefault();
    }).bind(this));

    this.initUsers();
  }

  handleProgress(event) {
    if(this.dragging) return;
    var progress = this.state.progressStart;
    progress = progress+(1000-progress)*this.audioElement.currentTime/this.audioElement.duration;
    if(progress) this.setState({progress});
  }

  handleBarChange = (event, value) => {
    this.dragging = true;
    this.setState({ progress : value })
  }

  handleSeek = (event, value) => {
    this.loadMedia(null,value);
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
        <button className="btn btn-primary mb-3 ml-3" onClick={this.copyURL}>
          INVITE
        </button>
        <button className="btn btn-primary mb-3 ml-3" onClick={this.toggleUserDrawer}>
          USERS
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
          max={1000}
          valueLabelDisplay="off"
          onChange={this.handleBarChange} 
          onChangeCommitted={this.handleSeek} 
        />
        <SongList songNames={this.state.songNames} users={this.state.users}/>
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
                }}> {this.props.roomID}
            </h6>
            <UserList roomId={this.props.roomID} userName={this.props.userName} songNames={this.state.songNames} users={this.state.users}/>
          </div>
        </Drawer>
      </div>
    );
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

