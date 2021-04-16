import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import { default as contract } from 'truffle-contract';

// Import our contract artifacts and turn them into usable abstractions.
import diary_artifacts from './contracts/Diary.json'

import "./App.css";

// TODO: start
class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, account: null, contract: null };

  componentDidMount = async () => {
    try {
      var self = this;

      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      const Diary = contract(diary_artifacts);

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
        self.setState({ web3, accounts: accs, account: accs[0], contract: Diary }, this.refreshEntries);
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  
  setStatus = (message) => {
    var status = document.getElementById("status");
    status.innerHTML = message;
  }

  addDiaryEntry = () => {
    var self = this;

    var content = document.getElementById("new-content").value;
    console.log(content);

    this.setStatus("Adding entry... (please wait)");

    var meta;
    this.state.contract.deployed().then(function (instance) {
      meta = instance;
      console.log("at line 62")
      return meta.addEntry(content, { from: this.state.account });
    }).then(function () {
      self.setStatus("Diary entry added!");
      self.refreshEntries();
      window.location.reload();
    }).catch(function (e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });
  }

  refreshEntries = () => {
    var self = this;

    var meta;
    this.state.contract.deployed().then(function (instance) {
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
      self.setStatus("Error getting diary entries; see log.");
    });
  }

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
