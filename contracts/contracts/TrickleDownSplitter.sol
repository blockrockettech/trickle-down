pragma solidity ^0.5.8;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/lifecycle/Pausable.sol";
import "@openzeppelin/contracts/access/roles/WhitelistedRole.sol";

contract TrickleDownSplitter is Pausable, WhitelistedRole {
    using SafeMath for uint256;

    address payable[] public participants;

    event FundsSplit(uint256 value, address payable[] participants);

    modifier onlyWhenContractHasABalance() {
        require(address(this).balance > 0, "There are no contract funds to send");
        _;
    }

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
        uint256 numOfParticipants = participants.length;
        require(participants.length > 0, "The participant addresses list is empty");

        uint256 lastParticipantIndex = numOfParticipants.sub(1);
        require(index <= lastParticipantIndex, "Array out of bounds reference");

        delete participants[index];

        // When the token to delete is the last token, the swap operation is unnecessary
        if (index != lastParticipantIndex) {
            participants[index] = participants[lastParticipantIndex];
        }

        participants.length--;
    }

    function splitFunds(uint256 value)
    whenNotPaused
    onlyWhenContractHasABalance
    external payable {
        require(value > 0, "No value has been specified");

        uint256 modulo = 10000;
        uint256 numOfParticipants = participants.length;
        uint256 individualSharePercentage = modulo.div(numOfParticipants);
        uint256 singleUnitOfValue = value.div(modulo);
        uint256 individualShare = singleUnitOfValue.mul(individualSharePercentage);

        for (uint i = 0; i < numOfParticipants; i++) {
            address payable participant = participants[i];
            (bool success,) = participant.call.value(individualShare)("");
            require(success, "Unable to send funds");
        }

        emit FundsSplit(value, participants);
    }

    function withdrawAllFunds() onlyWhitelisted external {
        (bool success,) = msg.sender.call.value(address(this).balance)("");
        require(success, "Failed to withdraw contract funds");
    }

    function() external payable {}
}
