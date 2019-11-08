pragma solidity ^0.5.8;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/lifecycle/Pausable.sol";
import "@openzeppelin/contracts/access/roles/WhitelistedRole.sol";

contract TrickleDownSplitter is Pausable, WhitelistedRole {
    using SafeMath for uint256;

    address payable[] public participants;

    constructor() public {
        super.addWhitelisted(msg.sender);
    }

    function setParticipants(address payable[] calldata _participants) onlyWhitelisted external {
        require(_participants.length > 0, "No addresses have been supplied");
        participants = _participants;
    }

    function addParticipant(address payable participant) onlyWhitelisted external {
        require(participant != address(0));
        participants.push(participant);
    }

    function removeParticipantAtIndex(uint256 index) onlyWhitelisted external {
        require(participants.length > 0, "No addresses have been supplied");

        uint256 numOfParticipants = participants.length;
        uint256 lastParticipantIndex = numOfParticipants.sub(1);
        require(index <= lastParticipantIndex, "Array out of bounds reference");

        delete participants[index];

        // When the token to delete is the last token, the swap operation is unnecessary
        if (index != lastParticipantIndex) {
            participants[index] = participants[lastParticipantIndex];
        }

        participants.length--;
    }

    function splitFunds() whenNotPaused external payable {
        require(participants.length > 0, "Cannot split as there are no addresses set");
        require(msg.value > 0, "No value has been sent");

        uint256 modulo = 10000;
        uint256 numOfParticipants = participants.length;
        uint256 individualSharePercentage = modulo.div(numOfParticipants);
        uint256 singleUnitOfValue = msg.value.div(modulo);
        for(uint i = 0; i < participants.length; i++) {
            address payable curator = participants[i];
            uint256 individualShare = singleUnitOfValue.mul(individualSharePercentage);
            (bool success, ) = curator.call.value(individualShare)("");
            require(success, "Unable to send funds");
        }
    }

    function withdrawAllFunds() onlyWhitelisted external {
        (bool success, ) = msg.sender.call.value(address(this).balance)("");
        require(success, "Failed to withdraw contract funds");
    }
}
