// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Vault {
    address public owner = msg.sender;
    uint256 public nonce;

    constructor() payable {
        require(msg.value > 0);
    }

    function unlock(bytes32 r, bytes32 s ,uint8 v) external {
        bytes32 message = keccak256(abi.encodePacked(nonce++, msg.sender));
        bytes32 ethSignedMessage = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", message));

        require(ecrecover(ethSignedMessage, v, r, s) == owner, "Invalid signature");

        msg.sender.call{value: address(this).balance}("");
    }
}