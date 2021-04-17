import React, { Component } from 'react'

export default class Home extends Component {
    render() {
        return (
            <div>
                <div className="fullscreen-bg">
                    <video loop muted autoPlay poster="img/videoframe.jpg" className="fullscreen-bg__video">
                        <source src="https://d27shkkua6xyjc.cloudfront.net/videos/maaemo-film-2.mp4?mtime=20141113185431" type="video/mp4" />
                    </video>
                </div>
                <div className="container" style={{ alignContent: "center" }}>
                    <div className=" row">
                        <div className="heading">
                            <p style={{ fontWeight: 700, fontSize: "3rem" }}>ET Watch</p>
                            <p id="subtext">An Interactive Journal powered by Ethereum Blockchain Technology</p>
                        </div>
                    </div>
                    <div className="row">
                        <h2 style={{}}>Enter Diary Entry</h2>
                    </div>
                    <br />
                    <div className="row">
                        <textarea className="diary-text-field form-control" id="new-content" placeholder="How was your day?"></textarea>
                    </div>
                    <br />
                    <div className="row">
                        <button id="start-record-btn" className="btn btn-lg btn-secondary" data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="Press the 'Start Recognition' button and allow access.">
                            <i className="fas fa-microphone" />
                        </button>
                        <button id="pause-record-btn" className="btn btn-lg btn-info"><i className="fas fa-microphone-slash" /></button>
                        <button className="btn btn-lg btn-info" id="send" onClick={this.props.handleSubmit}>Submit</button>
                    </div>
                    <br />
                    <div className="row">
                        {/* <p id="recording-instructions">Press the <strong>Start Recognition</strong> button and allow access.</p> */}
                        {/* <span id="status" /> */}
                    </div>
                    <div className="row">
                        <div className="container">
                            <h2>Previous Diary Entries</h2>
                            <div id="all-entries">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
