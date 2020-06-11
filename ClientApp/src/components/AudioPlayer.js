import React, { Component, forwardRef } from 'react';
import { SongList } from './SongList';
import AudioSpectrum from 'react-audio-spectrum';
import Slider from '@material-ui/core/Slider';
import MaterialButton from '@material-ui/core/Button';
import PauseIcon from '@material-ui/icons/Pause';

export class AudioPlayer extends Component {
  static displayName = "Audio Player";

  constructor(props) {
    super(props);
    this.state = {
      currentCount: 0,
      filename: "No File Selected",
      blob: [],
      volumeValue: 60,
      downloading: false,
      currentTime: 0
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

  async loadMedia() {
    var audio = document.getElementById('audio');
    var audioSrc = document.getElementById('audioSrc');
    var filename = document.getElementById('filetoget').value
    const response = await fetch('/mediahandler/downloadmedia?name=' + filename);
    const data = await response.json();
    this.setState({ blob: data.blob });
    audioSrc.src = data.blob;
    audio.load();
    this.setState({ downloading: false })
  }

  async updateSongNames() {
    const response = await fetch('mediahandler/getsongnames');
    const data = await response.json();
    this.setState({ songNames: data });
  }

  pause = () => {
    document.getElementById('audio-element').pause();
  }

  play = () => {
    document.getElementById('audio-element').play();
  }

  handleSeek(e, val) {
    this.setState({ currentTime: val });
    var scaled = val / 100 * document.getElementById('audio-element').duration;
    document.getElementById('audio-element').currentTime = scaled;
  }

  handleVolumeBar(e, val) {
    document.getElementById('audio-element').volume = val / 100;
    this.setState({ volumeValue: val });
  }

  updateTime() {
    // var val = this.state.currentTime / document.getElementById('audio-element').duration * 100;
    // this.setState({ seekValue: val });
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
        <SongList songNames={this.state.songNames} />

        <audio id="audio-element"
          src={this.state.blob}
          autoPlay
          onTimeUpdate={this.updateTime()}
        >
        </audio>
        <span>
          <AudioSpectrum
            id="audio-canvas"
            height={200}
            width={800}
            audioId={'audio-element'}
            capColor={'red'}
            capHeight={2}
            meterWidth={20}
            meterCount={750}
            meterColor={[
              { stop: 0, color: '#f00' },
              { stop: 0.5, color: '#0CD7FD' },
              { stop: 1, color: 'red' }
            ]}
            gap={4}
          />
        </span>
        <br></br>
        <MaterialButton id='play' variant='outlined' color='primary' onClick={this.play}>Play</MaterialButton>
        <MaterialButton id='pause' variant='outlined' color='primary' onClick={this.pause}>Pause</MaterialButton>

        <Slider id='seekBar'
          onChange={(e, val) => this.handleSeek(e, val)}
          value={this.state.currentTime}
          valueLabelDisplay='auto'
        ></Slider>
        <Slider id='volumeBar'
          onChange={(e, val) => this.handleVolumeBar(e, val)}
          value={this.state.volumeValue}
          valueLabelDisplay='auto'
        ></Slider>



      </div >
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
