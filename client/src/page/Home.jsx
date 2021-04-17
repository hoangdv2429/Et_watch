import React, { Component } from 'react'
import video from '../video_promotion_2.mp4'

export default class Home extends Component {
    render() {
        return (
            <div>
                <div>
                    <div class="overlay"></div>
                    <div className="fullscreen-bg">
                        <video loop muted autoPlay poster="img/videoframe.jpg" className="fullscreen-bg__video">
                            <source src={video} type="video/mp4" />
                        </video>
                    </div>
                </div>
                <div className="container">
                    <div className=" row">
                        <div className="heading">
                            <p className='heading-title' style={{ fontWeight: 700, fontSize: "3rem" }}>ET WATCH</p>
                            <p id="subtext">An Interactive Journal powered by Ethereum Blockchain Technology</p>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <h2 className="text-field-title">New Diary Entry</h2>
                    </div>
                    <div className="row">
                        <input className="form-control account-text-field" type="text" value={"Account: " + this.props.account} />
                    </div>
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
                        <button className="btn btn-lg btn-info" id="send" onClick={this.props.handleSubmit}>Save</button>
                    </div>
                    <br />
                    <div className="row">
                        {/* <p id="recording-instructions">Press the <strong>Start Recognition</strong> button and allow access.</p> */}
                        {/* <span id="status" /> */}
                    </div>
                    <div className="row">
                        <div className='previous-title'>Previous Diary Entries</div>
                        <div id="all-entries">
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
