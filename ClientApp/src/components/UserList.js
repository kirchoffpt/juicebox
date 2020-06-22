import React, { Component } from 'react';
import {ListGroupItem} from 'reactstrap';
import Slider from '@material-ui/core/Slider';

export class UserList extends Component {
  static displayName = "User List";

  constructor(props) {
    super(props);
    this.state = {activeIndex : null};
    this.listIdx = 0;
  }

  setCurrIdx(songname){
    this.setState({ activeIndex: songname })
  }

  render() {
    var userList = [];
    for(const user in this.props.users){
      userList.push(user);
    }
    if(userList){
        userList = userList.map((user) =>
        <UserElement 
            key={user} 
            index={user} 
            onClick={() => this.setCurrIdx(user)} 
            songname={this.props.users[user].songname}
            seekloc={this.props.users[user].seekloc}
            isActive={user === this.state.activeIndex}
            users={this.props.users}
        ></UserElement>
        );
    }

    return (
        <div className="listWrapper">
            <div id="list-example" className="list-group">
                <ListGroupItem onClick={this.handleClick} className="list-group-item list-group-item-action short-item" style={{paddingTop : 5, paddingBottom : 8}}>
                  <span className="badge badge-primary mr-1">{this.props.userName}</span>
                  <span className="badge badge-secondary ml-1">YOU</span>
                </ListGroupItem>
                {userList}
            </div>
        </div>
    );
  }
}

class UserElement extends Component {
  static displayName = "Song Element";

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick = () => this.props.onClick();

  render() {
    var classname = "list-group-item list-group-item-action short-item" + (this.props.isActive ? " active" : "");
    var pillBoxStyle = this.props.isActive ? {backgroundColor: "#1d1d1d"} : null;
    var songname = this.props.songname;
    return (
        <ListGroupItem onClick={this.handleClick} className={classname} style={{paddingTop : 5, paddingBottom : 0}}>
          <span className="badge badge-primary mr-1" style={pillBoxStyle}>{this.props.index}}</span>
          {songname}
          <Slider
            className = "nopadding listgroupseekbar"
            value={this.props.seekloc}
            aria-labelledby="discrete-slider-small-steps"
            step={10}
            min={0}
            max={1000}
            valueLabelDisplay="off"
            track="normal"
            style={{

            }}
          />
        </ListGroupItem>
    );
  }
}
