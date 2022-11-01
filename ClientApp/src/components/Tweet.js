import React, { Component } from 'react';

export class Tweet extends Component {
    render() {
        const tweetId = this.props.tweet.id;

        const tweetAddress = `https://twitter.com/usr/status/${tweetId}?ref_src=twsrc%5Etfw`;

        return (
            <div id={tweetId} >
                <blockquote className="twitter-tweet">
                    <a href={tweetAddress}>Loading...<br/>{tweetId}</a>
                </blockquote>
            </div>

        );
    }
}