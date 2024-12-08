// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTCollection is ERC721, Ownable {
    uint256 public nextTokenId;
    string public baseTokenURI;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseTokenURI,
        address initialOwner
    ) ERC721(_name, _symbol) Ownable(initialOwner) {
        baseTokenURI = _baseTokenURI;
    }

    function mint() public onlyOwner {
        _safeMint(msg.sender, nextTokenId);
        nextTokenId++;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }
}
