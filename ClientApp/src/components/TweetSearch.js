import React, { Component } from 'react';
import './css/TweetSearch.css';
import { SearchBar } from './SearchBar';
import { TweetsDisplay } from './TweetsDisplay';
import { SearchLog } from './SearchLog';
import { SearchLogEntry } from './SearchLogEntry';

export class TweetSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tweetsList: [],
            searchLog: [],
            iterator: 0
        };
    }

    clearData = () => {
        localStorage.clear();
        this.setState({
            iterator: 0,
            searchLog: [],
            tweetsList: []
        });
    }

    // Form the key for local storage processing of a tweets list
    formKey(searchLogEntry) {
        return `${searchLogEntry.dateTime}-${searchLogEntry.query}`;
    }

    // Update the search log in local storage to the current state
    updateSearchLogStorage = () => {
        const logString = JSON.stringify(this.state.searchLog);
        localStorage.setItem("searchLog", logString);
    }

    // Remove the given entry
    removeEntryByIndex = (ind) => {
        let log = this.state.searchLog;
        const entry = log[ind];
        localStorage.removeItem(this.formKey(entry));
        log.splice(ind, 1);
        this.setState({
            searchLog: log
        });
        this.updateSearchLogStorage();
    }

    // Set the tweets list to one corresponding to the given entry
    getTweetsByIndex = (ind) => {
        const entry = this.state.searchLog[ind];
        const tweetsString = localStorage.getItem(this.formKey(entry));
        const tweets = JSON.parse(tweetsString);
        this.setState({
            tweetsList: tweets,
            iterator: 0
        });
    }
    // Process the data from POST response
    // Update the search log with new meta data entry
    // Put the new tweets list in browser's local storage
    processSearchData = (searchData) => {
        let log = this.state.searchLog;
        const entry = searchData.meta;
        const tweets = searchData.tweets;

        if (log.length >= 10) {
            const oldestEntry = log.pop();
            localStorage.removeItem(this.formKey(oldestEntry));
        }

        log.unshift(entry);
        localStorage.setItem(this.formKey(entry), JSON.stringify(tweets));

        this.setState({
            searchLog: log,
            tweetsList: tweets,
            iterator: 0
        });

        this.updateSearchLogStorage();
    }

    // Get search log data from local storage
    startSetup = () => {
        const logString = localStorage.getItem("searchLog");
        if (logString === null)
            return;

        this.setState({
            searchLog: log
        });
    }

    // Startup setup
    componentDidMount() {
        this.startSetup();
    }

    // Set the iterator value
    handleIteratorChange = (newValue) => {
        this.setState({ iterator: newValue });
    }


    // POST /tweets
    // Send request data to TweetsController
    // Receive tweets list
    postSearchRequest = async (requestData) => {
        const response = await fetch(this.props.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        if (!response.ok) {
            alert(`Search unsuccessful: ${response.status}`);
            return;
        }
        const data = await response.json();

        this.processSearchData(data);
    }

    

    render() {

        const searchLogEntries = this.state.searchLog.map(
            (item) => {
                return (
                    <SearchLogEntry
                        key={item.dateTime}
                        entry={item}
                        index={this.state.searchLog.indexOf(item)}
                        repeatSearch={this.postSearchRequest}
                        getTweetsByIndex={this.getTweetsByIndex}
                        removeEntry={this.removeEntryByIndex}
                    />
                    )
            }
        );

        return (
            <div>
                <SearchBar
                    initiateSearch={this.postSearchRequest}
                />

                <br />
                <button onClick={this.clearData}>Clear Data</button>

                <SearchLog>
                    {searchLogEntries}
                </SearchLog>

                <TweetsDisplay
                    handleIteratorChange={this.handleIteratorChange}
                    iterator={this.state.iterator}
                    tweetsList={this.state.tweetsList}
                />
            </div>
        );
    }

    

}