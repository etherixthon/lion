// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SecureEventTicketing is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 public basePrice;
    uint256 public maxResalePercent;
    bool public resaleAllowed;

    uint256 private _nextTicketId;


    struct Ticket {
        uint256 price;
        bool forSale;
    }

    mapping(uint256 => Ticket) public tickets;

    constructor(uint256 _basePrice, uint256 _maxResalePercent) ERC721("EventTicket", "ETK") {
        basePrice = _basePrice;
        maxResalePercent = _maxResalePercent;
        resaleAllowed = true;
        _nextTicketId = 1;
    }

    function mint(address to, string memory tokenURI_) external onlyOwner {
        uint256 tokenId = _nextTicketId;
        _nextTicketId++;

        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        tickets[tokenId] = Ticket({
            price: basePrice,
            forSale: false
        });
    }

    function buyTicket(uint256 tokenId) public payable nonReentrant {
        require(_exists(tokenId), "Token does not exist");
        Ticket storage ticket = tickets[tokenId];
        require(ticket.forSale, "Ticket not for sale");
        require(msg.value >= ticket.price, "Insufficient payment");

        address seller = ownerOf(tokenId);

        _transfer(seller, msg.sender, tokenId);

        (bool success, ) = payable(seller).call{value: msg.value}("");
        require(success, "Ether transfer failed");

        ticket.forSale = false;
    }

    function listForResale(uint256 tokenId, uint256 newPrice) public nonReentrant {
        require(ownerOf(tokenId) == msg.sender, "Not the ticket owner");
        require(resaleAllowed, "Resale not allowed");

        uint256 maxPercentPrice = (basePrice * (100 + maxResalePercent)) / 100;
        uint256 absoluteMaxPrice = basePrice * 10; // Hard cap: 10x basePrice

        require(newPrice <= maxPercentPrice, "Exceeds max resale percent");
        require(newPrice <= absoluteMaxPrice, "Exceeds 10x base price");

        tickets[tokenId].price = newPrice;
        tickets[tokenId].forSale = true;
    }

    function setResaleRules(bool allowed, uint256 maxPercent) external onlyOwner {
        resaleAllowed = allowed;
        maxResalePercent = maxPercent;
    }

    function setBasePrice(uint256 newBasePrice) external onlyOwner {
        basePrice = newBasePrice;
    }

    function isContract(address account) internal view returns (bool) {
        return account.code.length > 0;
    }

    function getTicketDetails(uint256 tokenId) external view returns (uint256 price, bool forSale) {
        require(_exists(tokenId), "Token does not exist");
        Ticket memory ticket = tickets[tokenId];
        return (ticket.price, ticket.forSale);
    }

    function nextTicketId() external view returns (uint256) {
        return _nextTicketId;
    }
}
