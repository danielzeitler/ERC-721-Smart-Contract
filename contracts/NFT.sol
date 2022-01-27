// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    string private _customBaseURI;
    uint256 private _price;
    uint256 private _maxMintable;

    constructor(string memory initialURI) ERC721("NFT", "NFT") {
      _customBaseURI = initialURI;
      _price = 0.05 ether;
      _maxMintable = 20;
    }

    function _baseURI() internal view virtual override returns (string memory) {
      return _customBaseURI;
    }

    function setBaseURI(string memory newBaseURI) public onlyOwner {
      _customBaseURI = newBaseURI;
    }

    function purchase(uint256 quantity) public payable {
        require(msg.value >= _price * quantity, "not enough eth send");
        require(quantity <= 10, "Can't mint more than 10");
        payable(owner()).transfer(_price * quantity);

        for(uint i = 0; i < quantity; i++) {
          mintForPurchase(msg.sender);
        }
    } 

    function currentSupply() public view returns(uint256) {
      return _tokenIds.current();
    }

    function mintForPurchase(address recipient) private {
        _tokenIds.increment();
        require(_tokenIds.current() <= _maxMintable, "Project is finished minting");

        uint256 newItemId = _tokenIds.current();
        _safeMint(recipient, newItemId);
    }
}