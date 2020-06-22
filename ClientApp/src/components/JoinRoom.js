import React, { Component } from 'react';
import { NavLink } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';


export class JoinRoom extends Component {

  constructor(props) {
    super(props);
    this.state = { availableRooms : null, 
    };
  }

  async getRooms() {
    const response = await fetch('mediahandler/getusedrooms');
    const data = await response.json();
    this.setState({availableRooms : data});
  }

  componentDidMount() {
    this.getRooms();
  }

  render() {
    var rooms = this.state.availableRooms;
    if(rooms === null){
      return (
        <div className="h-100 row align-items-center">
          <div className="col">
            <CircularProgress color="inherit"/>
          </div>
        </div>
      );
    } else if(rooms.length > 0){
      rooms = rooms.map((room) =>
    <NavLink key={room} tag={Link} to={"/"+room}><button className="btn btn-primary btn-lg btn-block">{room}</button></NavLink>
      );
    } else {
      return (
        <div>
        <span className="badge badge-danger ml-6">NO ROOMS WITH AVAILABLE AUDIO</span>
        <NavLink tag={Link} to={"/"+Math.random().toString(36).substring(7)}><button className="btn btn-primary btn-lg btn-block">CREATE ROOM</button></NavLink>
        </div>
      )
    }

    return (
      <div>
        {rooms}
      </div>
    );
  }
}

