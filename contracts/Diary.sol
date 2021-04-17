pragma solidity ^0.5.16;

contract Diary {
  address payable private owner;
  string private testPhrase;

  struct Entry {
    string content;
  }

  mapping (uint => Entry) private entries;
  uint private numEntries;

  function getNumEntries() public returns (uint){
    return numEntries;
  }

  // Constructor
  function theDiary(/*string encryptedTestPhrase*/) public {
    owner = msg.sender;
    numEntries = 0;
    testPhrase = "password";
  }

  function addEntry(string memory content) public returns (bool success) {
    if (msg.sender != owner) 
      return false;
    entries[numEntries].content = content;
    numEntries++;
    return true;
  }

  function setEntry(uint index, string memory content) public returns (bool success) {
    if (msg.sender != owner) return false;

    Entry storage entry = entries[index];

    if (keccak256(abi.encode(content)) != keccak256(abi.encode(entry.content))) {
      entry.content = content;
    }

    return true;
  }

  function getEntry(uint index) public view returns (string memory content) {
    content = entries[index].content;
  }

  function getEntries() public view returns (string memory allEntries) {
    if (numEntries == 0) return '';

    uint totalLength = 0;
    for (uint i=0; i < numEntries; i++) {
      totalLength = totalLength + bytes(entries[i].content).length + 1;
    }

    bytes memory result = bytes(new string(totalLength));
    uint counter = 0;
    uint i;
    for (i=0; i < numEntries; i++) {
      bytes memory content = bytes(entries[i].content);
      for (uint x=0; x < content.length; x++) {
        result[counter] = content[x];
        counter++;
      }

      if (i != (numEntries - 1)) {
        result[counter] = byte(',');
        counter++;
      }
    }

    return string(result);
  }

  function getTestPhrase() public view returns (string memory phrase) {
    return testPhrase;
  }

  function getOwner() public view returns (address ownerAddress) {
    return owner;
  }

  function kill() public {
    if (msg.sender == owner) selfdestruct(msg.sender);
  }
}