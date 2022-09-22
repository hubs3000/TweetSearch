import React, { Component } from 'react';
import { TweetSearch } from './components/TweetSearch';

export default class App extends Component {
  static displayName = App.name;

  render() {
      return (
          <TweetSearch
              url = '/tweets'
          />
      
    );
  }
}
