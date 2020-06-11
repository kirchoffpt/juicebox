import React, { Component } from 'react';

export class SongList extends Component {
  static displayName = "Song List";

  constructor(props) {
    super(props);
    this.state = { activeIndex: null };
    this.listIdx = 0;
  }

  setCurrSong(index, songname) {
    document.getElementById("filetoget").value = songname;
    this.setState({ activeIndex: index })
  }

  render() {

    var listItems = this.props.songNames
    this.listIdx = 0;
    if (listItems) {
      listItems = this.props.songNames.map((songname) =>
        <SongElement
          key={songname}
          index={this.listIdx}
          onClick={index => this.setCurrSong(index, songname)}
          songname={songname}
          isActive={this.listIdx++ == this.state.activeIndex}
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
  static displayName = "Song List";

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick = () => this.props.onClick(this.props.index);

  render() {
    var classname = "list-group-item list-group-item-action" + (this.props.isActive ? " active" : "");
    return (
      <a onClick={this.handleClick} className={classname}>{this.props.songname}</a>
    );
  }
}
