const TrickleDownSplitter = artifacts.require('TrickleDownSplitter');

module.exports = async function (deployer, network, accounts) {
    console.log(`Whitelisting on [${network}]`);

    const creator = accounts[0];

    const splitter = await TrickleDownSplitter.deployed();
    console.log('splitter.address', splitter.address);

    console.log('Whitelisting TrickleDown API');
    await splitter.addWhitelisted('0xd34A6Ae121afC6B93bAfb55258eFC0af3E09c724', { from: creator });

    console.log('Whitelisting BlockRocket Admin');
    await splitter.addWhitelistAdmin('0x818Ff73A5d881C27A945bE944973156C01141232', { from: creator });
};
