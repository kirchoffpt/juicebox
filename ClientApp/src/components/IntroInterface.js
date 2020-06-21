import React, { Component } from 'react';

export class IntroInterface extends Component {

  constructor(props) {
    super(props);
    this.state = { currentCount: 0, 
    };
  }

  render() {
   
    return (
      <div>
        <div className="container">
        <div className="row">&nbsp;</div>
        <div className="row">
            <div style={{color : "rgb(255,255,255)"}} className="col-2">User</div>
            <div className="col-4"><input type="text" id="userInput" /></div>
        </div>
        <div className="row">
            <div style={{color : "rgb(255,255,255)"}} className="col-2">Message</div>
            <div className="col-4"><input type="text" id="messageInput" /></div>
        </div>
        <div className="row">&nbsp;</div>
        <div className="row">
            <div className="col-6">
                <input type="button" id="sendButton" value="Send Message" />
            </div>
        </div>
    </div>
    <div className="row">
        <div className="col-12">
            <hr />
        </div>
    </div>
    <div className="row">
        <div className="col-6">
            <ul style={{color : "rgb(255,255,255)"}} id="messagesList"></ul>
        </div>
    </div>
      </div>
    );
  }
}

