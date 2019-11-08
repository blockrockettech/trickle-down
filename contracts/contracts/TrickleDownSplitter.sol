pragma solidity ^0.5.8;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/roles/WhitelistedRole.sol";

contract TrickleDownSplitter is WhitelistedRole {
    using SafeMath for uint256;

    address[] curators;

    constructor() public {
        super.addWhitelisted(msg.sender);
    }

    function setCurators(address[] calldata _curators) onlyWhitelisted external {
        require(_curators.length > 0, "No addresses have been supplied");
        curators = _curators;
    }

    function withdrawAllFunds() onlyWhitelisted external {
        msg.sender.call.value(address(this).balance)("");
    }

    function _convertToAddressPayable(address toConvert) private pure returns (address payable) {
        return address(uint160(toConvert));
    }
}
