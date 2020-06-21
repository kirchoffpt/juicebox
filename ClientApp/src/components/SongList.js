import React, { Component } from 'react';
import {ListGroupItem} from 'reactstrap';
import Slider from '@material-ui/core/Slider';

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
            users={this.props.users}
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
    var pillBoxStyle = this.props.isActive ? {backgroundColor: "#1d1d1d"} : null;
    var songname = this.props.songname;
    var userloc = [];
    var usersOnSong = 0;
    for (const user in this.props.users) {
      var userinfo = this.props.users[user];
      if(userinfo.songname === songname) usersOnSong++;
    }
    if(usersOnSong <= 0) usersOnSong = null;
    return (
        <ListGroupItem onClick={this.handleClick} className={classname}>
          {songname}<span className="ml-2 fixed-right badge badge-pill badge-primary" style={pillBoxStyle}>{usersOnSong}</span>
        </ListGroupItem>
    );
  }
}
