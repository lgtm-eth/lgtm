//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
 * A simple contract for use in testing the source analyzer.
 */

contract Simple is ERC721 {
    address public addressAye;
    uint256 public uint256Bee;
    struct MyType {
        string myTypeName;
        uint256 myTypeCount;
    }

    constructor(address _addressAye, uint256 _uint256Bee) {
        addressAye = _addressAye;
        uint256Bee = _uint256Bee;
    }

    // prettier-ignore
    function
    methodCee(uint256 uint256ParameterDee, MyType calldata myTypeParameterEee) external payable {
        emit EventEee(uint256ParameterDee);
    }
}
