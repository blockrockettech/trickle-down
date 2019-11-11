const _ = require('lodash');
const { utils } = require('ethers');
const splitter = require('express').Router({mergeParams: true});

const authTokenChecker = require('./middlewares/authTokenChecker');
const { getHttpProvider }  = require('../web3/provider');
const { getContractBalance } = require('../services/TrickleDownSplitterService');

// Set this middleware as early as possible to protect all routes below
splitter.use(authTokenChecker);

splitter.get('/balances', async (req, res, next) => {
    const chainId = req.params.chainId;
    const provider = getHttpProvider(chainId);
    const contractBalance = await getContractBalance(provider, chainId);

    const accounts = await provider.listAccounts();
    const apiBalance = utils.formatEther(await provider.getBalance(accounts[0])).toString();

    return res
        .status(200)
        .json({
            api: `${apiBalance} ETH`,
            contract: `${contractBalance} ETH`
        });
});

module.exports = splitter;
