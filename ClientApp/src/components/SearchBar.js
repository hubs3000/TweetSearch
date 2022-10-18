import React, { Component } from 'react';

export class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
            hasImages: false
        };
        this.initiateSearch = this.initiateSearch.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleQueryChange = this.handleQueryChange.bind(this);
    }

    initiateSearch(e) {
        e.preventDefault();
        if (this.state.query === "") {
            alert("Can not send an empty search query");
            return;
        }
        const pattern1 = new RegExp('[^A-Za-z0-9 ]');
        const pattern2 = new RegExp('[A-Z-a-z0-9]');
        if (pattern1.test(this.state.query)) {
            alert("Use only alphanumeric characters and spaces");
            return;
        }
        if (!pattern2.test(this.state.query)) {
            alert("Type in something besides spaces");
            return;
        }

        let requestData = {
            query: this.state.query,
            hasImages: this.state.hasImages
        };
        this.props.initiateSearch(requestData);
        this.setState({ query: "" });
    }

    handleQueryChange(e) {
        this.setState({ query: e.target.value });
    }

    handleCheckboxChange(e) {
        this.setState({ hasImages: e.target.checked });
    }

    render() {

        return (
            <div>

                <form onSubmit={this.initiateSearch}>
                    <input
                        type="text"
                        placeholder="Type in search query"
                        value={this.state.query}
                        onChange={this.handleQueryChange}
                    />
                    <button>Search</button>
                    <br/>
                    <input
                        type="checkbox"
                        id="images"
                        onChange={this.handleCheckboxChange}
                    />
                    <label htmlFor="images">Tweets with images</label>
                    
                </form>
            </div>

            );
    }
}