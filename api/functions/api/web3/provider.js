const Web3 = require('web3');
const functions = require('firebase-functions');
const {getNetworkName} = require('@blockrocket/utils');
const { ethers, Wallet } = require('ethers');

const { mnemonic, infura_key } = functions.config().trickle_down;

const httpProviderWeb3 = {};
const walletForNetwork = {};

function createWallet(network) {
    let provider = new ethers.providers.Web3Provider(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

    if (network != 5777) {
        provider = ethers.getDefaultProvider(getNetworkName(network));
    }

    return Wallet.fromMnemonic(mnemonic).connect(provider);
}

const getHttpProvider = (network) => {
    if (httpProviderWeb3[network]) {
        return httpProviderWeb3[network];
    }

    const wallet = createWallet(network);
    httpProviderWeb3[network] = wallet.provider;
    walletForNetwork[network] = wallet;
    return httpProviderWeb3[network];
};

const getWallet = (network) => {
    if (walletForNetwork[network]) {
        return walletForNetwork[network];
    }

    const wallet = createWallet(network);
    httpProviderWeb3[network] = wallet.provider;
    walletForNetwork[network] = wallet;
    return walletForNetwork[network];
};

module.exports = {
    getHttpProvider,
    getWallet
};
