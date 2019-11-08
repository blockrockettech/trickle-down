const {BN, constants, expectRevert} = require('openzeppelin-test-helpers');

require('chai').should();

const TrickleDownSplitter = artifacts.require('TrickleDownSplitter');

contract('Tokenlandia token custom implementation tests', function ([creator, auction, another, ...accounts]) {
    const participants = [
        accounts[0],
        accounts[1],
        accounts[2],
        accounts[3],
        accounts[4],
    ];

    const fromCreator = { from: creator };

    beforeEach(async function () {
       this.splitter = await TrickleDownSplitter.new(fromCreator);
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

           it('can remove a participant', async function () {
               await this.splitter.setParticipants(participants, fromCreator);

               await this.splitter.removeParticipantAtIndex(2);

               const participant3 = await this.splitter.participants(2);
               participant3.should.be.equal(participants[4]);
           });
        });
    });
});
