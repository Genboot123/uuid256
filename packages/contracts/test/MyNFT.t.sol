// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {MyNFT} from "../src/MyNFT.sol";
import {Uuid256} from "../src/Uuid256.sol";

contract MyNFTTest is Test {
    MyNFT nft;

    function setUp() public {
        nft = new MyNFT("MyNFT", "MNFT", "ipfs://base/");
    }

    function test_mint_accepts_when_upper128_zero_and_tokenURI_canonical() public {
        bytes16 uuid = 0x01890f882bbf7c84bec06fbb8cbfcdad;
        uint256 tokenId = Uuid256.fromBytes16(uuid); // upper 128 = 0

        address to = address(0xBEEF);
        nft.mint(to, tokenId);
        assertEq(nft.ownerOf(tokenId), to);

        string memory uri = nft.tokenURI(tokenId);
        // Should start with base and contain 0x + 64 hex
        assertTrue(_startsWith(uri, "ipfs://base/0x"));
        assertEq(bytes(uri).length, bytes(string.concat("ipfs://base/0x", _hexLen(32))).length);
    }

    function test_mint_reverts_when_upper128_nonzero() public {
        uint256 bad = (uint256(1) << 200) | 0xdeadbeef;
        vm.expectRevert(bytes("UPPER128_NOT_ZERO"));
        nft.mint(address(this), bad);
    }

    // version checks removed: UUID bridge enforces only upper128==0

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
        for (uint256 i = 0; i < arr.length; i++) {
            arr[i] = bytes1("0");
        }
        return string(arr);
    }
}
