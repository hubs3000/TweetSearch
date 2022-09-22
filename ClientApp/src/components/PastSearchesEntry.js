import React, { Component } from 'react';
import './css/PastSearchesEntry.css';

export class PastSearchesEntry extends Component {
    constructor(props) {
        super(props);
    }

    repeatSearch = () => {
        const requestData = {
            query: this.props.entry.query,
            hasImages: this.props.entry.hasImages
        };
        this.props.repeatSearch(requestData);
    }

    displayTweets = () => {
        this.props.getTweetsByIndex(this.props.index);
    }

    removeEntry = () => {
        this.props.removeEntry(this.props.index);
    }

    render() {
        return (
            <div className="entry">
                <div>{this.props.entry.query}</div>
                <div>{this.props.entry.dateTime}</div>
                <div>Tweets found: {this.props.entry.result_count}</div>
                <button onClick={this.repeatSearch}>Repeat</button>
                <button onClick={this.displayTweets}>Display</button>
                <button onClick={this.removeEntry}>Remove</button>
            </div>

        );
    }
}