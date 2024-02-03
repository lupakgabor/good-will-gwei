// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

struct Charity {
    address withdrawAddress;
    string name;
    string description;
    bool is_withdrawn;
    uint balance;
}

contract Donate {

    address public owner;
    mapping(address => Charity) public charities;

    constructor() payable {
        owner = msg.sender;
    }

    function addCharity(address charityAddress, string memory name, string memory description) public payable ownerOnly {
        require(charities[charityAddress].withdrawAddress == address(0), "This charity is already in our list.");

        charities[charityAddress] = Charity({
            withdrawAddress: charityAddress,
            name: name,
            description: description,
            is_withdrawn: false,
            balance: 0
        });
    }

    function removeCharity(address charityAddress) public payable ownerOnly registeredCharity(charityAddress) {
        Charity storage charity = charities[charityAddress];

        if (charity.balance != 0) {
            payable(charity.withdrawAddress).transfer(charity.balance);
        }

        delete charities[charityAddress];
    }

    function donate(address charityAddress) public payable registeredCharity(charityAddress) {
        Charity storage charity = charities[charityAddress];
        charity.balance = charity.balance + msg.value;
    }

    function withDraw() public payable registeredCharity(msg.sender) {
        require(charities[msg.sender].balance != 0, "There is no funds.");
        payable(msg.sender).transfer(charities[msg.sender].balance);
    }

    // This is extremely strange but this project aims to practice.
    // This will help to test all functionality in the UI more easily.
    function beTheOwner() public payable {
        owner = msg.sender;
    }

    modifier ownerOnly() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    modifier registeredCharity (address charityAddress) {
        require(charities[charityAddress].withdrawAddress != address(0), "This charity is not registered.");
        _;
    }
}
