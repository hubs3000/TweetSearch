import React, { Component } from 'react';
import { Tweet } from './Tweet';
import './css/TweetsDisplay.css';

export class TweetsDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tweetsOnScreen: 5
        };
    }

    handleIteratorChange = (x) => {
        if (x >= 0 && x + this.state.tweetsOnScreen <= this.props.tweetsList.length) {
            this.revertPanelChange();
            this.props.handleIteratorChange(x);
        }
    }

    itrUp = () => {
        this.handleIteratorChange(this.props.iterator + 1);
    }

    itrDown = () => {
        this.handleIteratorChange(this.props.iterator - 1);
    }

    handleSliderChange = (e) => {
        const newValue = parseInt(e.target.value);
        if (this.props.iterator + newValue > this.props.tweetsList.length)
            return;

        this.revertPanelChange();
        this.setState({ tweetsOnScreen: newValue });
    }

    changePanels = () => {
        let myDiv = document.getElementById("tweets");
        let first = myDiv.firstElementChild;
        let last = myDiv.lastElementChild;

        if (first !== null) {

            if (this.props.iterator > 0) {
                first.className = "side-panel";
                first.addEventListener("click", this.itrDown);
            }

            if (this.props.iterator + this.state.tweetsOnScreen < this.props.tweetsList.length) {
                last.className = "side-panel";
                last.addEventListener("click", this.itrUp);
            }
            
        }
    }

    revertPanelChange = () => {
        let myDiv = document.getElementById("tweets");
        let first = myDiv.firstElementChild;
        let last = myDiv.lastElementChild;

        if (first !== null) {
            first.className = "";
            last.className = "";


            first.removeEventListener("click", this.itrDown);
            last.removeEventListener("click", this.itrUp);
        }
    }

    

    componentDidUpdate() {
        const script = document.createElement('script');
        script.src = "//platform.twitter.com/widgets.js";
        script.async = true;
        document.body.appendChild(script);

        this.changePanels();
    }


    render() {

        let tweetsList = this.props.tweetsList.map(
            (item) => {
                return (
                    <Tweet
                        key={item.id}
                        tweet={item}
                    />
                )
            }
        );

        if (tweetsList.length === 0)
            tweetsList.push(<p>No tweets to display</p>);
        
        const sliderMin = 3;
        const sliderMax = 8;

        let sliderMarks = [];
        for (let i = sliderMin; i <= sliderMax; i++) {
            let opt = <option key={i} value={i} label={i}/>;
            sliderMarks.push(opt);
        };

        return (
            <div>
                <h1 className="header">TWEETS</h1>

                <div id="slider">
                    <label htmlFor="tweets-on-screen">Tweets on display: {this.state.tweetsOnScreen}</label> <br/>
                    <input
                        id="tweets-on-screen"
                        type="range"
                        value={this.state.tweetsOnScreen}
                        min={sliderMin}
                        max={sliderMax}
                        onInput={this.handleSliderChange}
                        list="slider-marks"
                    />
                    <datalist id="slider-marks">
                        {sliderMarks}
                    </datalist>

                </div>
                
                <div className="tweets" id="tweets">
                    {tweetsList.slice(this.props.iterator, this.props.iterator + this.state.tweetsOnScreen)}
                </div>
            </div>

            

        );
    }
}


   