import React, { Component } from 'react';
import {ListGroupItem} from 'reactstrap';

export class SongList extends Component {
  static displayName = "Song List";

  constructor(props) {
    super(props);
    this.state = {activeIndex : this.props.activeSong};
    this.listIdx = 0;
  }

  setCurrSong(songname){
    this.props.setCurrSong(songname);
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
            isActive={songname === this.props.activeSong}
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
    var usersOnSong = 0;
    for (const user in this.props.users) {
      var userinfo = this.props.users[user];
      if(userinfo.songname === songname) usersOnSong++;
    }
    if(usersOnSong <= 0) usersOnSong = null;
    return (
        <ListGroupItem onClick={this.handleClick} className={classname} id={songname}>
          {songname}<span className="ml-2 fixed-right badge badge-pill badge-primary" style={pillBoxStyle}>{usersOnSong}</span>
        </ListGroupItem>
    );
  }
}
