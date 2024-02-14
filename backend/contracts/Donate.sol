// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

// Store this amount of meta data in the blockchain is too expensive, not recommended in a real world project.
struct Charity {
    address charityAddress;
    string name;
    string description;
    uint balance;
    uint index;
}

contract Donate {

    address public manager; // Maybe manager is a better name?
    mapping(address => Charity) public charities;
    address[] public charityAddresses;

    constructor() payable {
        manager = msg.sender;
    }

    function getAllCharityAddress() public view returns(address[] memory) {
        return charityAddresses;
    }

    function addCharity(address charityAddress, string memory name, string memory description) public payable managerOnly {
        require(charities[charityAddress].charityAddress == address(0), "This charity is already in our list.");

        charities[charityAddress] = Charity({
            charityAddress: charityAddress,
            name: name,
            description: description,
            balance: 0,
            index: charityAddresses.length
        });

        charityAddresses.push(charityAddress);
    }

    function removeCharity(address charityAddress) public payable managerOnly registeredCharity(charityAddress) {
        Charity storage charity = charities[charityAddress];

        if (charity.balance != 0) {
            payable(charity.charityAddress).transfer(charity.balance);
        }

        delete charityAddresses[charity.index];
        delete charities[charityAddress];
    }

    function donate(address charityAddress) public payable registeredCharity(charityAddress) {
        Charity storage charity = charities[charityAddress];
        charity.balance = charity.balance + msg.value;
    }

    function withdraw() public payable registeredCharity(msg.sender) {
        require(charities[msg.sender].balance != 0, "There is no funds.");
        payable(msg.sender).transfer(charities[msg.sender].balance);
        charities[msg.sender].balance = 0;
    }

    // This is extremely strange but this project aims to practice.
    // This will help to test all functionality in the UI more easily.
    function beTheOwner() public payable {
        manager = msg.sender;
    }

    modifier managerOnly() {
        require(msg.sender == manager, "Only the manager can perform this action.");
        _;
    }

    modifier registeredCharity (address charityAddress) {
        require(charities[charityAddress].charityAddress != address(0), "This charity is not registered.");
        _;
    }
}
