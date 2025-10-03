// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {U256ID} from "../src/U256ID.sol";

contract U256IDTest is Test {
    function buildV1(uint64 t48, uint32 n32, uint16 c16, uint256 r156) internal pure returns (uint256 id) {
        // mask inputs to field widths
        t48 &= uint64((uint64(1) << 48) - 1);
        n32 &= 0xffffffff;
        c16 &= 0xffff;
        r156 &= (uint256(1) << 156) - 1;
        id = 0;
        id |= (uint256(1) << 252); // version = 1
        id |= uint256(t48) << 204; // T48
        id |= uint256(n32) << 172; // N32
        id |= uint256(c16) << 156; // C16
        id |= r156; // R156
    }

    function test_versionOf_v0_and_isSupported() public {
        // version 0: ensure upper 4 bits are zero
        uint256 id0 = uint256(keccak256("v0")) & ((uint256(1) << 252) - 1);
        uint8 v = U256ID.versionOf(id0);
        assertEq(v, 0, "version should be 0");
        assertTrue(U256ID.isSupported(id0), "v0 should be supported");
    }

    function test_v1_field_extractors_and_isSupported() public {
        uint64 t = 0x0000_00ab_cdef_1234; // lower 48 bits significant
        uint32 n = 0x89abcd01;
        uint16 c = 0x2345;
        uint256 r = 0x1234_5678_9abc_def0_1234_5678_9abc_def0_1234; // trimmed to 156 bits below
        uint256 id1 = buildV1(t, n, c, r);

        uint8 v = U256ID.versionOf(id1);
        assertEq(v, 1, "version should be 1");
        assertTrue(U256ID.isSupported(id1), "v1 should be supported");

        uint64 gotT = U256ID.v1TimestampMs(id1);
        uint32 gotN = U256ID.v1Node32(id1);
        uint16 gotC = U256ID.v1Counter16(id1);

        assertEq(gotT, t & ((uint64(1) << 48) - 1), "T48 mismatch");
        assertEq(gotN, n, "N32 mismatch");
        assertEq(gotC, c, "C16 mismatch");
    }

    function test_isSupported_false_for_other_versions() public {
        // set version nibble to 0b0010 (2)
        uint256 id2 = (uint256(2) << 252) | (uint256(keccak256("rest")) & ((uint256(1) << 252) - 1));
        uint8 v = U256ID.versionOf(id2);
        assertEq(v, 2, "version should be 2");
        assertFalse(U256ID.isSupported(id2), "v2 should be unsupported");
    }
}
