// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {Uuid256} from "../src/Uuid256.sol";

/// @dev Harness to ensure the revert happens in a deeper call frame than the cheatcode
contract Uuid256Harness {
    function callToBytes16(uint256 id) external pure returns (bytes16) {
        return Uuid256.toBytes16(id);
    }
}

contract Uuid256Test is Test {
    function test_upper128Zero_true_when_upper_is_zero() public pure {
        uint256 id = uint256(uint128(type(uint128).max));
        assertTrue(Uuid256.upper128Zero(id));
    }

    function test_upper128Zero_false_when_upper_nonzero() public pure {
        uint256 id = (uint256(1) << 255) | 123;
        assertFalse(Uuid256.upper128Zero(id));
    }

    function test_toBytes16_roundtrip() public pure {
        bytes16 uuid = 0x0123456789abcdef0123456789abcdef;
        uint256 bridged = Uuid256.fromBytes16(uuid);
        assertTrue(Uuid256.upper128Zero(bridged));
        bytes16 back = Uuid256.toBytes16(bridged);
        assertEq(back, uuid);
    }

    function test_toBytes16_reverts_when_upper_not_zero() public {
        uint256 bad = (uint256(1) << 200) | 0xdeadbeef;
        Uuid256Harness h = new Uuid256Harness();
        vm.expectRevert(bytes("UPPER128_NOT_ZERO"));
        h.callToBytes16(bad);
    }
}
