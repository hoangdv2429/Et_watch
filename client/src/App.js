import React, { Component } from "react";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import getWeb3 from "./getWeb3";
import { default as contract } from 'truffle-contract';

// Import our contract artifacts and turn them into usable abstractions.
import diary_artifacts from './contracts/Diary.json'

import "./App.css";
import Home from "./page/Home";

class App extends Component {
    state = { storageValue: 0, web3: null, accounts: null, account: null, contract: null };

    componentDidMount = async () => {
        try {
            var self = this;

            // Get network provider and web3 instance.
            const web3 = await getWeb3();
            const Diary = contract(diary_artifacts);

            console.log(Diary);
            // Bootstrap the MetaCoin abstraction for Use.
            Diary.setProvider(web3.currentProvider);

            // Use web3 to get the user's accounts.
            // Get the initial account balance so it can be displayed.
            await web3.eth.getAccounts(function (err, accs) {
                if (err != null) {
                    alert("There was an error fetching your accounts.");
                    return;
                }

                if (accs.length === 0) {
                    alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                    return;
                }

                console.log(accs[0]);
                // Set web3, accounts, and contract to the state, and then proceed with an
                // example of interacting with the contract's methods.

                self.setState({ web3, accounts: accs, account: accs[0], contract: Diary });
                self.refreshEntries();
                self.voiceRecognition();
            });
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    createNotification = (type, message) => {
        switch (type) {
            case "info":
                NotificationManager.info(message, '', 2000);
                break;
            case "success":
                NotificationManager.success(message, '');
                break;
            case "warning":
                NotificationManager.warning(message, '', 2000);
                break;
            case "error":
                NotificationManager.error(message, '');
                break;
        };
    };

    addDiaryEntry = (e) => {
        e.preventDefault();
        console.log("Chay addDiary Entry");
        var self = this;

        var content = document.getElementById("new-content").value;
        console.log(content);

        self.createNotification("info", "Adding entry... (please wait)");

        var meta;
        self.state.contract.deployed().then(function (instance) {
            meta = instance;
            console.log("at line 62")
            return meta.addEntry(content, { from: self.state.account });
        }).then(function () {
            self.createNotification("success", "Diary entry added!");
            self.refreshEntries();
            window.location.reload();
        }).catch(function (e) {
            console.log(e);
            self.createNotification("error", "Error sending coin; see log.");
        });
    }

    refreshEntries = () => {
        var self = this;
        console.log("Chay refreshEntries");
        console.log(self.state)
        var meta;
        self.state.contract.deployed().then(function (instance) {
            meta = instance;
            return meta.getEntries.call({ from: self.state.account });
        }).then(function (value) {
            // var entries_element = document.getElementById("all-entries");
            console.log("Retrieved values are : " + value);
            var str_array = value.split(',');
            var ul = document.getElementById('all-entries');
            var li;
            for (var i = 0; i < str_array.length; i++) {
                // Trim the excess whitespace.
                str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
                li = document.createElement('div');
                li.className = "card";
                var temp = document.createElement('div');
                temp.className = "card-body";
                temp.append(document.createTextNode(str_array[i]));
                li.appendChild(temp);
                ul.appendChild(li);
                ul.appendChild(document.createElement('br'));
            }
        }).catch(function (e) {
            console.log(e);
            self.createNotification("error", "Error getting diary entries; see log.");
        });
    }

    voiceRecognition = () => {
        var self = this;

        try {
            console.log("in speech");
            var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            var recognition = new SpeechRecognition();
        }
        catch (e) {
            console.error(e);
            alert("Please upgrade your browser");
        }

        // var noteTextarea = $('#new-content');
        // var instructions = $('#recording-instructions');
        var noteTextarea = document.getElementById('new-content');
        // var instructions = document.getElementById('recording-instructions');

        var noteContent = '';
        var recognizing = false;

        /*-----------------------------
              Voice Recognition 
        ------------------------------*/

        // If false, the recording will stop after a few seconds of silence.
        // When true, the silence period is longer (about 15 seconds),
        // allowing us to keep recording even when the user pauses. 
        recognition.continuous = true;

        // This block is called every time the Speech APi captures a line. 
        recognition.onresult = function (event) {

            // event is a SpeechRecognitionEvent object.
            // It holds all the lines we have captured so far. 
            // We only need the current one.
            var current = event.resultIndex;

            // Get a transcript of what was said.
            var transcript = event.results[current][0].transcript;

            // Add the current transcript to the contents of our Note.
            // There is a weird bug on mobile, where everything is repeated twice.
            // There is no official solution so far so we have to handle an edge case.
            var mobileRepeatBug = (current === 1 && transcript === event.results[0][0].transcript);

            if (!mobileRepeatBug) {
                noteContent += transcript;
                noteTextarea.value = noteContent;
            }
        };

        recognition.onstart = function () {
            recognizing = true;
            self.createNotification('info', 'Voice recognition activated. Try speaking into the microphone.');
            // instructions.textContent = 'Voice recognition activated. Try speaking into the microphone.';
        }

        recognition.onspeechend = function () {
            recognizing = false;
            self.createNotification('info', 'You were quiet for a while so voice recognition turned itself off.');
            // instructions.textContent = 'You were quiet for a while so voice recognition turned itself off.';
        }

        recognition.onerror = function (event) {
            recognizing = false;
            if (event.error === 'no-speech') {
                self.createNotification('info', 'No speech was detected. Try again.');
                // instructions.textContent = 'No speech was detected. Try again.';
            };
        }

        /*-----------------------------
              App buttons and input 
        ------------------------------*/
        const startButton = document.getElementById('start-record-btn');
        const pauseButton = document.getElementById('pause-record-btn');

        startButton.onclick = (e) => {
            if (noteContent.length) {
                noteContent += ' ';
            }
            startButton.classList.value = 'btn btn-lg btn-info';
            pauseButton.classList.value = 'btn btn-lg btn-secondary';

            if (!recognizing) {
                recognition.start();
            } else {
                self.createNotification('warning', 'Recognition has already started.');
            }
        };

        pauseButton.onclick = (e) => {
            recognition.stop();
            self.createNotification('info', 'Voice recognition paused.');
            // instructions.textContent = 'Voice recognition paused.';

            startButton.classList.value = 'btn btn-lg btn-secondary';
            pauseButton.classList.value = 'btn btn-lg btn-info';
        };

        // Sync the text inside the text area with the noteContent variable.
        noteTextarea.oninput = (e) => {
            console.log(e.target.value)
            noteContent = e.target.value;
        };


        /*-----------------------------
              Speech Synthesis 
        ------------------------------*/

        // function readOutLoud(message) {
        //     var speech = new SpeechSynthesisUtterance();

        //     // Set the text and voice attributes.
        //     speech.text = message;
        //     speech.volume = 1;
        //     speech.rate = 1;
        //     speech.pitch = 1;

        //     window.speechSynthesis.speak(speech);
        // }
    }

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div>
                <NotificationContainer />
                <Home handleSubmit={this.addDiaryEntry} account={this.state.account} />
            </div>
        );
    }
}

export default App;
