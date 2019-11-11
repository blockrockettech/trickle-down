const {utils} = require('ethers');
const TrickleDownSplitterTruffleConfig = require('../data/truffle/TrickleDownSplitter');

//todo: remove this example code in comments
//  const provider = getHttpProvider(chainId);
// const signer = provider.getSigner();
// console.log(signer);
// const contract = new ethers.Contract(
//     splitterAddress,
//     TrickleDownSplitter.abi,
//     signer,
// );

async function getContractBalance(provider, network) {
    const contractAddress = TrickleDownSplitterTruffleConfig.networks[network].address;
    return utils.formatEther(await provider.getBalance(contractAddress)).toString();
}

module.exports = {
    getContractBalance,
};
