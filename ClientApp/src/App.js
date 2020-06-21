import React, { Component } from 'react';
import { Route, Switch, useParams, Redirect } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { AudioPlayer } from './components/AudioPlayer';

import './custom.css'
import { IntroInterface } from './components/IntroInterface';

export default class App extends Component {
  static displayName = App.name;

  componentDidMount() {
    document.body.style.backgroundColor = "rgb(24,24,24)";
  }

  render() {
    var userName = Math.random().toString(36).substring(7);
    return (
      <Layout>
        <Switch>
          <Route path='/About' component={Home} />
          <Route exact path='/' component={IntroInterface} />
          <Route path="/:id" children={<Child userName={userName}/>} />
        </Switch>
      </Layout>
    );
  }
}

function Child(props) {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let {id} = useParams();

  if(id.length > 6){
  id = id.substr(0,6);
  return <Redirect to={id}/>
  }

  return (
    <div>
      <AudioPlayer roomID={id} userName={props.userName}></AudioPlayer>
    </div>
  );
}

