// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Uuid256 - UUID (bytes16) ⇄ uint256 bridge helpers
/// @notice Bridges canonical UUIDs (128-bit) into the lower 128 bits of a uint256.
/// Upper 128 bits MUST be zero when accepting a bridged uint256.
library Uuid256 {
    /// @notice Check whether the upper 128 bits are all zero.
    /// @param id The bridged uint256 value.
    /// @return True if upper 128 bits are zero.
    function upper128Zero(uint256 id) internal pure returns (bool) {
        return (id >> 128) == 0;
    }

    /// @notice Extract the UUID bytes16 from the lower 128 bits.
    /// @dev Reverts if the upper 128 bits are not zero.
    /// @param id The bridged uint256 value with upper 128 bits zero.
    /// @return uuid The UUID as bytes16 (big-endian order preserved in hex rendering).
    function toBytes16(uint256 id) internal pure returns (bytes16 uuid) {
        require(upper128Zero(id), "UPPER128_NOT_ZERO");
        uuid = bytes16(uint128(id));
    }

    /// @notice Build a bridged uint256 from a UUID bytes16. Upper 128 bits are zero.
    /// @param uuid The UUID to bridge.
    /// @return id The bridged uint256 value.
    function fromBytes16(bytes16 uuid) internal pure returns (uint256 id) {
        id = uint256(uint128(uuid));
    }
}
