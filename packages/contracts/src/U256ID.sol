// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title U256ID helpers (read-only on-chain)
/// @notice version nibble & v1 field extractors. Off-chain generates IDs.
library U256ID {
    /// @dev Upper 4 bits (MSB): version
    function versionOf(uint256 id) internal pure returns (uint8) {
        return uint8(id >> 252);
    }

    // v1 layout: vvvv | T[48] | N[32] | C[16] | R[156]

    /// @notice v1: Unix millis (48-bit)
    function v1TimestampMs(uint256 id) internal pure returns (uint64) {
        return uint64((id >> 204) & ((1 << 48) - 1));
    }

    /// @notice v1: NodeID (32-bit)
    function v1Node32(uint256 id) internal pure returns (uint32) {
        return uint32((id >> 172) & 0xffffffff);
    }

    /// @notice v1: Monotonic counter within the same ms (16-bit)
    function v1Counter16(uint256 id) internal pure returns (uint16) {
        return uint16((id >> 156) & 0xffff);
    }

    /// @notice Accept only supported versions (v0, v1)
    function isSupported(uint256 id) internal pure returns (bool) {
        uint8 v = versionOf(id);
        return v == 0 || v == 1;
    }
}
