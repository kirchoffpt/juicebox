import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { AudioPlayer } from './components/AudioPlayer';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path='/' component={AudioPlayer} />
        <Route path='/About' component={Home} />
      </Layout>
    );
  }
}
