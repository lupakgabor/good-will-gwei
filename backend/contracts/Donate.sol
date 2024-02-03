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

    function addCharity(address withdrawAddress, string memory name, string memory description) public payable ownerOnly {
        require(charities[withdrawAddress].withdrawAddress == address(0), "This charity is already in our list!");

        charities[withdrawAddress] = Charity({
            withdrawAddress: withdrawAddress,
            name: name,
            description: description,
            is_withdrawn: false,
            balance: 0
        });
    }

    function donate(address charityAddress) public payable {
        require(charities[charityAddress].withdrawAddress != address(0), "This charity is not registered!");

        Charity storage charity = charities[charityAddress];
        charity.balance = charity.balance + msg.value;
    }

    modifier ownerOnly() {
        require(msg.sender == owner, "Only the owner can perform this action!");
        _;
    }
}
