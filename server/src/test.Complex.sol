//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
 * A contract with complex methods for use in testing the source analyzer.
 */

contract Complex {
    struct NameCount {
        string name;
        uint256 count;
        NestedNameCount nested;
    }
    struct NestedNameCount {
        bool success;
    }

    // prettier-ignore
    function
    fooMethod(NameCount calldata nameCountA, NameCount calldata nameCountB) external payable {

    }
}
