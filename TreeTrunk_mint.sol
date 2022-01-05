// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol';
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol';
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol';

abstract contract Events {

    event TOKEN_MINTED(string message);

    event TOKEN_TRANSFERED(string message);

}

abstract contract TokenIdGenerator {

    uint tokenId;

    function getTokenId() public returns (uint) {
        return ++tokenId;
    }
}

contract Minting721 is ERC721URIStorage, TokenIdGenerator, Events, Ownable {

    mapping(address => uint256[]) tokensOwnedBy;

    constructor(string memory _name, string memory _symbol, string memory baseUri) onlyOwner() ERC721(_name, _symbol){
    }

    function mintToken(address to, string memory tokenUri) onlyOwner() public {
        require(address(to) != address(0), "Invalid address");
        require(bytes(tokenUri).length > 0, "Invalid Token URI");
        uint tokenId = getTokenId();
        require(tokenId > 0, "Token Id must be greater than 0");
        _mint(to, tokenId);
        emit TOKEN_MINTED(string(abi.encodePacked("Token minted : ", tokenId)));
        _setTokenURI(tokenId, tokenUri);
        tokensOwnedBy[to].push(tokenId);
    }

    function getTokensOwnnedBy(address user) onlyOwner() public view returns (uint256[] memory) {
        require(address(user) != address(0), "Invalid address");
        return tokensOwnedBy[user];
    }
}