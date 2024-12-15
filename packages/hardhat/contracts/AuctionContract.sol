// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTAuction is ReentrancyGuard {
    struct Auction {
        address seller;
        uint256 tokenId;
        uint256 startingPrice;
        uint256 highestBid;
        address highestBidder;
        uint256 endTime;
        bool ended;
    }

    IERC721 public nftContract;
    uint256 public auctionCount;
    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => mapping(address => uint256)) public bids;

    event AuctionCreated(uint256 auctionId, uint256 tokenId, uint256 startingPrice, uint256 duration);
    event BidPlaced(uint256 auctionId, address bidder, uint256 amount);
    event AuctionEnded(uint256 auctionId, address winner, uint256 amount);

    constructor(address _nftContract) {
        nftContract = IERC721(_nftContract);
    }

    // Start an auction
    function startAuction(uint256 _tokenId, uint256 _startingPrice, uint256 _duration) external {
        require(nftContract.ownerOf(_tokenId) == msg.sender, "You are not the owner of this NFT");
        require(nftContract.isApprovedForAll(msg.sender, address(this)), "Contract not approved to transfer NFT");

        auctionCount++;
        uint256 auctionId = auctionCount;

        auctions[auctionId] = Auction({
            seller: msg.sender,
            tokenId: _tokenId,
            startingPrice: _startingPrice,
            highestBid: 0,
            highestBidder: address(0),
            endTime: block.timestamp + _duration,
            ended: false
        });

        // Transfer NFT to contract
        nftContract.transferFrom(msg.sender, address(this), _tokenId);

        emit AuctionCreated(auctionId, _tokenId, _startingPrice, _duration);
    }

    // Place a bid
    function placeBid(uint256 _auctionId) external payable nonReentrant {
        Auction storage auction = auctions[_auctionId];
        require(block.timestamp < auction.endTime, "Auction has ended");
        require(msg.value > auction.highestBid, "Bid is too low");

        // Refund previous highest bidder
        if (auction.highestBid > 0) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }

        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;

        emit BidPlaced(_auctionId, msg.sender, msg.value);
    }

    // End the auction
    function endAuction(uint256 _auctionId) external nonReentrant {
        Auction storage auction = auctions[_auctionId];
        require(block.timestamp >= auction.endTime, "Auction is still ongoing");
        require(!auction.ended, "Auction has already ended");

        auction.ended = true;

        // Transfer funds to the seller
        if (auction.highestBid > 0) {
            payable(auction.seller).transfer(auction.highestBid);
            nftContract.safeTransferFrom(address(this), auction.highestBidder, auction.tokenId);
        } else {
            // No bids, return NFT to seller
            nftContract.safeTransferFrom(address(this), auction.seller, auction.tokenId);
        }

        emit AuctionEnded(_auctionId, auction.highestBidder, auction.highestBid);
    }
}
