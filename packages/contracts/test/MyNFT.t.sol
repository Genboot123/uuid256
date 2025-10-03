// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {MyNFT} from "../src/MyNFT.sol";
import {U256ID} from "../src/U256ID.sol";

contract MyNFTTest is Test {
    MyNFT nft;

    function setUp() public {
        nft = new MyNFT("MyNFT", "MNFT", "ipfs://base/");
    }

    function test_mint_v0_accepts_and_tokenURI_canonical() public {
        // v0: ensure top nibble zero
        uint256 id0 = uint256(keccak256("some-random")) & ((uint256(1) << 252) - 1);
        assertTrue(U256ID.isSupported(id0));

        address to = address(0xBEEF);
        nft.mint(to, id0);
        assertEq(nft.ownerOf(id0), to);

        string memory uri = nft.tokenURI(id0);
        // Should start with base and contain 0x + 64 hex
        assertTrue(_startsWith(uri, "ipfs://base/0x"));
        assertEq(bytes(uri).length, bytes(string.concat("ipfs://base/0x", _hexLen(32))).length);
    }

    function test_mint_v1_accepts() public {
        uint256 id1 = (uint256(1) << 252) | (uint256(keccak256("rest")) & ((uint256(1) << 252) - 1));
        assertTrue(U256ID.isSupported(id1));
        nft.mint(address(this), id1);
        assertEq(nft.ownerOf(id1), address(this));
    }

    function test_mint_reverts_for_unsupported_version() public {
        uint256 bad = (uint256(2) << 252) | (uint256(keccak256("rest")) & ((uint256(1) << 252) - 1));
        vm.expectRevert(bytes("U256ID: unsupported version"));
        nft.mint(address(this), bad);
    }

    // --- helpers ---
    function _startsWith(string memory s, string memory prefix) internal pure returns (bool) {
        bytes memory bs = bytes(s);
        bytes memory bp = bytes(prefix);
        if (bs.length < bp.length) return false;
        for (uint256 i = 0; i < bp.length; i++) {
            if (bs[i] != bp[i]) return false;
        }
        return true;
    }

    function _hexLen(uint256 bytesLen) internal pure returns (string memory) {
        // returns string of '0's with length 64 for 32 bytes, used only to compare lengths
        bytes memory arr = new bytes(bytesLen * 2);
        for (uint256 i = 0; i < arr.length; i++) arr[i] = bytes1("0");
        return string(arr);
    }
}
