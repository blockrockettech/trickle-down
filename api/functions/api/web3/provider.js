const Web3 = require('web3');
const functions = require('firebase-functions');
const {getNetworkName} = require('@blockrocket/utils');
const { ethers, Wallet } = require('ethers');

const { mnemonic, infura_key } = functions.config().trickle_down;

const httpProviderWeb3 = {};
const walletForNetwork = {};

function createWallet(network) {
    let host = `http://127.0.0.1:7545`;
    if (network != 5777) {
        host = `https://${getNetworkName(network)}.infura.io/v3/${infura_key}`;
    }

    return Wallet
        .fromMnemonic(mnemonic)
        .connect(new ethers.providers.Web3Provider(new Web3.providers.HttpProvider(host)));
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
