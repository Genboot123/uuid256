// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import {Strings} from "lib/openzeppelin-contracts/contracts/utils/Strings.sol";
import {U256ID} from "./U256ID.sol";

contract MyNFT is ERC721 {
    using U256ID for uint256;
    using Strings for uint256;

    string private _base;

    constructor(string memory name_, string memory symbol_, string memory base_) ERC721(name_, symbol_) {
        _base = base_;
    }

    /// @notice Off-chain generated U256ID (uint256) を受け入れてミント
    function mint(address to, uint256 tokenId) external {
        require(tokenId.isSupported(), "U256ID: unsupported version"); // v0 or v1
        _safeMint(to, tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return _base;
    }

    /// @notice tokenURI: base + 0x + 64hex（正準）
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return string.concat(_baseURI(), Strings.toHexString(tokenId, 32));
    }
}
