const {BN, constants, expectRevert} = require('openzeppelin-test-helpers');

require('chai').should();

const TrickleDownSplitter = artifacts.require('TrickleDownSplitter');

contract('Trickle down tests', function ([creator, another, random, ...accounts]) {
    const participants = [
        accounts[0],
        accounts[1],
        accounts[2],
        accounts[3],
        accounts[4],
    ];

    const fromCreator = { from: creator };
    const fromRandom = { from: random };

    beforeEach(async function () {
       this.splitter = await TrickleDownSplitter.new(fromCreator);
        (await this.splitter.isWhitelisted(creator)).should.be.true;
    });

    describe('participant management', function() {
        describe('when whitelisted', function() {
           it('can set a list of participants in one transaction', async function() {
               await this.splitter.setParticipants(participants, fromCreator);

               // Sample some to ensure persistence
               const participant3  = await this.splitter.participants(2);
               participant3.should.be.equal(participants[2]);

               const participant5 = await this.splitter.participants(4);
               participant5.should.be.equal(participants[4]);
           });

           it('can add a new participant', async function () {
               await this.splitter.setParticipants(participants, fromCreator);

               // Add a new participant and check it has been added
               await this.splitter.addParticipant(another, fromCreator);

               const latestParticipantFromContract = await this.splitter.participants(5);
               latestParticipantFromContract.should.be.equal(another);
           });

            it('reverts when adding a participant from address zero', async function () {
                expectRevert.unspecified(this.splitter.addParticipant(constants.ZERO_ADDRESS, fromCreator));
            });

           it('can remove a participant', async function () {
               await this.splitter.setParticipants(participants, fromCreator);

               await this.splitter.removeParticipantAtIndex(2);

               const participant3 = await this.splitter.participants(2);
               participant3.should.be.equal(participants[4]);
           });

           it('reverts when calling remove for an undefined participant list', async function () {
               expectRevert(
                   this.splitter.removeParticipantAtIndex(2),
                   "No addresses have been supplied"
               );
           });

           it('reverts when trying to remove a participant at an out of bounds index', async function() {
               await this.splitter.setParticipants(participants);
               expectRevert(
                   this.splitter.removeParticipantAtIndex(6),
                   "Array out of bounds reference"
               );
           });
        });
        describe('when not whitelisted', function() {
           it('reverts when setting up a list of participants', async function () {
               expectRevert(this.splitter.setParticipants(participants, fromRandom),
                   "WhitelistedRole: caller does not have the Whitelisted role"
               );
           });

           it('reverts when adding a new participant', async function () {
               expectRevert(this.splitter.addParticipant(another, fromRandom),
                   "WhitelistedRole: caller does not have the Whitelisted role"
               );
           });

           it('reverts when removing a participant', async function() {
              expectRevert(
                  this.splitter.removeParticipantAtIndex(1),
                  "WhitelistedRole: caller does not have the Whitelisted role"
              );
           });
        });
    });
});
