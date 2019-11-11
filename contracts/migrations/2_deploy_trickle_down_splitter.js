const TrickleDownSplitter = artifacts.require('TrickleDownSplitter');

module.exports = async function (deployer, network, accounts) {
    console.log(`Deploying TrickleDownSplitter to ${network}`);

    const creator = accounts[0];

    await deployer.deploy(TrickleDownSplitter, { from: creator });
    const splitter = await TrickleDownSplitter.deployed();
    console.log('splitter.address', splitter.address);
};
