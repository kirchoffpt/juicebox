import React, { Component } from 'react';

export class SongList extends Component {
  static displayName = "Song List";

  constructor(props) {
    super(props);
    this.state = {activeIndex : null};
    this.listIdx = 0;
  }

  setCurrSong(songname){
    document.getElementById("filetoget").value = songname; 
    this.setState({ activeIndex: songname })
  }

  render() {
   
    var listItems = this.props.songNames
    if(listItems){
        listItems = this.props.songNames.map((songname) =>
        <SongElement 
            key={songname} 
            index={songname} 
            onClick={() => this.setCurrSong(songname)} 
            songname={songname}
            isActive={songname === this.state.activeIndex}
            />
        );
    }

    return (
        <div className="listWrapper">
            <div id="list-example" className="list-group">
                {listItems}
            </div>
        </div>
    );
  }
}

class SongElement extends Component {
  static displayName = "Song Element";

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick = () => this.props.onClick();

  render() {
    var classname = "list-group-item list-group-item-action" + (this.props.isActive ? " active" : "");
    return (
        <button onClick={this.handleClick} className={classname}>{this.props.songname}</button>
    );
  }
}
