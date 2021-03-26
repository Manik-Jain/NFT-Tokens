// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol';
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol';

contract NFTokenDetails {
    
    string name;
    string symbol;
    
    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }
}

abstract contract TokenMetadata is NFTokenDetails {
    
    uint private id;
    
    function getNewTokenId() public returns(uint) {
        return ++id;
    } 
    
    function getTokenId() public view returns(uint) {
        return id;
    }
    
}

contract Deployable is TokenMetadata, Ownable {
    
    mapping(address => uint[]) private tokenHolders;
    
    event TOKEN_MINTED(address to, uint tokenId);
    event TOKEN_AMOUNT_CREDITED_FROM(address from, uint tokenId);
    
    modifier validDetails(string memory name, string memory symbol) {
        require(bytes(name).length != 0, '[PANIC] : Token should have a Name');
        require(bytes(symbol).length != 0, '[PANIC] : Token should have a symbol');
        _;
    }
    
    constructor(string memory name, string memory symbol) validDetails(name, symbol) NFTokenDetails(name, symbol) {}
    
    function mint() public payable returns(uint) {
        require(msg.value > 0, '[ALERT] : Each token is worth some value');
        (uint tokenId, bool success) = _mintTo(msg.sender);
        require(success, '[ALERT] : Token minting procedure has failed');
        TOKEN_MINTED(msg.sender, tokenId);
        payable(address(this)).transfer(msg.value);
        TOKEN_AMOUNT_CREDITED_FROM(msg.sender, tokenId);
        return tokenId;
    }
    
    function _mintTo(address to) private returns(uint, bool) {
        require(to != address(0), 'Assignee address should be a valid address');
        uint newTokenId = getNewTokenId();
        require(newTokenId <= 10 ** 60, '[PANIC] : Max token id reached');
        tokenHolders[to].push(newTokenId);
        return(newTokenId, true);
    }
    
    function tokensOf(address tokenHolder) external view returns(uint[] memory) {
        require(tokenHolder != address(0), '[ALERT] : Invalid token owner address');
        return tokenHolders[tokenHolder];
    }
    
    function contractBalance() external view onlyOwner() returns(uint) {
        return address(this).balance;
    }
    
    receive() payable external {
        
    }
}
