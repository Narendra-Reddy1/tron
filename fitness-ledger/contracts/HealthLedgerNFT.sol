// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HealthLedgerNFT is ERC721URIStorage, Ownable {
    string private s_baseUri;

    constructor(string memory _name, string memory _symbol, string memory _baseUri)
        ERC721(_name, _symbol)
        Ownable(msg.sender)
    {
        s_baseUri = _baseUri;
    }

    function mint(address _to, uint256 _tokenId, string calldata _tokenURI) external onlyOwner {
        _mint(_to, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
    }

    function _baseURI() internal view override returns (string memory) {
        return s_baseUri;
    }
}
