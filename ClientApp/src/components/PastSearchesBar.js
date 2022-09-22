import React, { Component } from 'react';
import './css/PastSearchesBar.css';

export class PastSearchesBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isToggled: true
        };
    }

    toggleEntriesBar = () => {
        this.setState({ isToggled: !this.state.isToggled });
    }

    render() {

        let entriesBar; 

        if (this.state.isToggled) {
            entriesBar = 
                <div className="entries">
                    {this.props.children}
                </div>
        }

        return (
            <div>
                <h1 className="header" onClick={this.toggleEntriesBar}>PAST SEARCHES</h1>
                {entriesBar}
            </div>

        );
    }
}