// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTCollection is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    
    constructor(
        string memory name_,
        string memory symbol_,
        address initialOwner
    ) ERC721(name_, symbol_) Ownable(initialOwner) {
        tokenCounter = 0;
    }

    function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
    uint256 newTokenId = tokenCounter;
    _mint(recipient, newTokenId); // This already emits the Transfer event (ERC721 standard)
    _setTokenURI(newTokenId, tokenURI);
    tokenCounter += 1;

    emit Transfer(address(0), recipient, newTokenId);

    return newTokenId;
}
}