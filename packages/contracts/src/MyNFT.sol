// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import {Strings} from "lib/openzeppelin-contracts/contracts/utils/Strings.sol";
import {Uuid256} from "./Uuid256.sol";

contract MyNFT is ERC721 {
    using Uuid256 for uint256;
    using Strings for uint256;

    string private _base;

    constructor(string memory name_, string memory symbol_, string memory base_) ERC721(name_, symbol_) {
        _base = base_;
    }

    /// @notice Off-chain generated bridged uint256 tokenId (upper 128 bits MUST be zero)
    function mint(address to, uint256 tokenId) external {
        require(Uuid256.upper128Zero(tokenId), "UPPER128_NOT_ZERO");
        _mint(to, tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return _base;
    }

    /// @notice tokenURI: base + 0x + 64hex
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return string.concat(_baseURI(), Strings.toHexString(tokenId, 32));
    }
}
