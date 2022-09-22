import React, { Component } from 'react';
import './css/TweetSearch.css';
import { SearchBar } from './SearchBar';
import { TweetsDisplay } from './TweetsDisplay';
import { PastSearchesBar } from './PastSearchesBar';
import { PastSearchesEntry } from './PastSearchesEntry';

export class TweetSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tweetsList: [],
            pastSearchesList: [],
            iterator: 0
        };
    }

    // Startup setup
    componentDidMount() {
        this.getPastSearchesList();
    }

    // Set the iterator value
    handleIteratorChange = (newValue) => {
        this.setState({ iterator: newValue });
    }


    // POST /tweets
    // Send request data to TweetsController
    // Receive 
    postSearchRequest = async (requestData) => {
        const response = await fetch(this.props.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        if (!response.ok) {
            alert("Search unsuccessful");
            return;
        }
        const data = await response.json();
        this.setState({
            tweetsList: data,
            iterator: 0
        });
        await this.getPastSearchesList();
    }

    // GET /tweets/{ind}
    getTweetsByIndex = async (ind) => {
        const response = await fetch(this.props.url + '/' + ind);
        const data = await response.json();
        this.setState({
            tweetsList: data,
            iterator: 0
        });
    }

    // GET /tweets
    getPastSearchesList = async () => {
        const response = await fetch(this.props.url);
        const data = await response.json();
        this.setState({ pastSearchesList: data });
    }

    // DELETE /tweets/{ind}
    removePastSearchesEntryByIndex = async (ind) => {
        await fetch(this.props.url + '/' + ind, {
            method: 'DELETE'
        });
        await this.getPastSearchesList();
    }

    render() {

        const pastSearchesList = this.state.pastSearchesList.map(
            (item) => {
                return (
                    <PastSearchesEntry
                        key={item.dateTime}
                        entry={item}
                        index={this.state.pastSearchesList.indexOf(item)}
                        repeatSearch={this.postSearchRequest}
                        getTweetsByIndex={this.getTweetsByIndex}
                        removeEntry={this.removePastSearchesEntryByIndex}
                    />
                    )
            }
        );

        return (
            <div>
                <SearchBar
                    initiateSearch={this.postSearchRequest}
                />

                <PastSearchesBar>
                    {pastSearchesList}
                </PastSearchesBar>

                <TweetsDisplay
                    handleIteratorChange={this.handleIteratorChange}
                    iterator={this.state.iterator}
                    tweetsList={this.state.tweetsList}
                />
            </div>
        );
    }

    

}