import React, { Component } from 'react';
import { NavLink } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';

export class IntroInterface extends Component {

  constructor(props) {
    super(props);
    this.state = { currentCount: 0, 
    };
  }

  render() {
   
    return (
      <div>
        <NavLink tag={Link} to={"/"+Math.random().toString(36).substring(7)}><button className="btn btn-primary btn-lg btn-block">CREATE ROOM</button></NavLink>
        <NavLink tag={Link} to={"/join"}><button className="btn btn-primary btn-lg btn-block">JOIN ROOM</button></NavLink>
      </div>
    );
  }
}

