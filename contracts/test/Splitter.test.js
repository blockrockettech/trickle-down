const {BN, constants, expectRevert, ether, balance} = require('openzeppelin-test-helpers');

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
                await expectRevert.unspecified(this.splitter.addParticipant(constants.ZERO_ADDRESS, fromCreator));
            });

           it('can remove a participant', async function () {
               await this.splitter.setParticipants(participants, fromCreator);

               await this.splitter.removeParticipantAtIndex(2);

               const participant3 = await this.splitter.participants(2);
               participant3.should.be.equal(participants[4]);
           });

           it('reverts when calling remove for an undefined participant list', async function () {
               await expectRevert(
                   this.splitter.removeParticipantAtIndex(2, fromCreator),
                   "No addresses have been supplied"
               );
           });

           it('reverts when trying to remove a participant at an out of bounds index', async function() {
               await this.splitter.setParticipants(participants, fromCreator);
               await expectRevert(
                   this.splitter.removeParticipantAtIndex(6, fromCreator),
                   "Array out of bounds reference"
               );
           });
        });
        describe('when not whitelisted', function() {
           it('reverts when setting up a list of participants', async function () {
               await expectRevert(this.splitter.setParticipants(participants, fromRandom),
                   "WhitelistedRole: caller does not have the Whitelisted role"
               );
           });

           it('reverts when adding a new participant', async function () {
               await expectRevert(this.splitter.addParticipant(another, fromRandom),
                   "WhitelistedRole: caller does not have the Whitelisted role"
               );
           });

           it('reverts when removing a participant', async function() {
              await expectRevert(
                  this.splitter.removeParticipantAtIndex(1, fromRandom),
                  "WhitelistedRole: caller does not have the Whitelisted role"
              );
           });
        });
    });

    describe('splitting funds', function() {
        it('should revert when the contract is paused', async function() {
            await this.splitter.pause(fromCreator);
            await expectRevert.unspecified(this.splitter.splitFunds(0, fromCreator));
        });

        describe('when no participants have been set', function() {
            it('reverts', async function() {
               expectRevert(
                   this.splitter.splitFunds(0, fromCreator),
                   "Cannot split as there are no addresses set"
               );
            });
        });

        describe('when participants have been set', function () {
            const oneEth = ether('1');
            const quarterEth = ether('0.25');

            beforeEach(async function () {
                await this.splitter.setParticipants(participants, fromCreator);
            });

            it('evenly splits the funds', async function () {
                const participant1Balance = await balance.tracker(participants[0]);
                const participant2Balance = await balance.tracker(participants[1]);
                const participant3Balance = await balance.tracker(participants[2]);
                const participant4Balance = await balance.tracker(participants[3]);
                const participant5Balance = await balance.tracker(participants[4]);

                await web3.eth.sendTransaction({
                    from: creator,
                    to: this.splitter.address,
                    value: oneEth
                });

                await this.splitter.splitFunds(quarterEth, fromCreator);

                const modulo = new BN('10000');
                const singleUnitOfValue = quarterEth.div(modulo);
                const individualSharePercentage = modulo.div(new BN(participants.length.toString()));
                const individualShare = singleUnitOfValue.mul(individualSharePercentage);

                (await participant1Balance.delta()).should.be.bignumber.equal(individualShare);
                (await participant2Balance.delta()).should.be.bignumber.equal(individualShare);
                (await participant3Balance.delta()).should.be.bignumber.equal(individualShare);
                (await participant4Balance.delta()).should.be.bignumber.equal(individualShare);
                (await participant5Balance.delta()).should.be.bignumber.equal(individualShare);
            });
        });
    });
});
