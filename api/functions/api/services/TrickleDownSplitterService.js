const {ethers, utils} = require('ethers');
const TrickleDownSplitterTruffleConfig = require('../data/truffle/TrickleDownSplitter');

async function getContractBalance(provider, network) {
    const contractAddress = TrickleDownSplitterTruffleConfig.networks[network].address;
    return utils.formatEther(await provider.getBalance(contractAddress)).toString();
}

async function splitFunds(signer, network, weiToSplit) {
    const contractAddress = TrickleDownSplitterTruffleConfig.networks[network].address;
    const contract = new ethers.Contract(
        contractAddress,
        TrickleDownSplitterTruffleConfig.abi,
        signer
    );
    return await contract.splitFunds(utils.bigNumberify(weiToSplit), {
        gasLimit: 400000
    });
}

module.exports = {
    getContractBalance,
    splitFunds
};
