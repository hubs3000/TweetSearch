import React, { Component } from 'react';
import { TweetSearch } from './components/TweetSearch';
import './custom.css';

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
