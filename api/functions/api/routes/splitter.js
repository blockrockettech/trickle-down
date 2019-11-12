const axios = require('axios');
const { utils } = require('ethers');
const splitter = require('express').Router({mergeParams: true});

const authTokenChecker = require('./middlewares/authTokenChecker');
const { getHttpProvider, getWallet }  = require('../web3/provider');
const { getContractBalance, splitFunds } = require('../services/TrickleDownSplitterService');

// Set this middleware as early as possible to protect all routes below
splitter.use(authTokenChecker);

splitter.get('/balances', async (req, res, next) => {
    const chainId = req.params.chainId;
    const provider = getHttpProvider(chainId);
    const wallet = getWallet(chainId);
    const contractBalance = await getContractBalance(provider, chainId);

    const apiBalance = utils.formatEther(await provider.getBalance(wallet.address)).toString();

    return res
        .status(200)
        .json({
            api: `${apiBalance} ETH`,
            contract: `${contractBalance} ETH`
        });
});

splitter.post('/split', async (req, res, next) => {
    const { amount, currency } = req.body;
    if (!amount || !currency) {
        return res.status(500)
            .json({
                msg: 'Please supply amount and currency'
            });
    }

    if (amount && Number(amount) > 5) {
        return res.status(500)
            .json({
                msg: 'Amount too high - must be less than or equal to 5'
            });
    }

    const coinGeckoPriceUrl = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,gbp,eur";
    const coinGeckoPrices = (await axios.get(coinGeckoPriceUrl)).data;
    const { ethereum } = coinGeckoPrices;

    if(!ethereum[currency.toLowerCase()]) {
        return res.status(500)
            .json({
                msg: `No conversion rate is available for ${currency}`
            });
    }

    const conversionRate = ethereum[currency.toLowerCase()];
    const ethToSplit = (Number(amount) / conversionRate).toFixed(8);
    const weiToSplit = utils.parseEther(ethToSplit.toString());

    const chainId = req.params.chainId;
    const wallet = getWallet(chainId);
    const tx = await splitFunds(wallet, chainId, weiToSplit);

    return res.status(200)
        .json({
            conversion: {
                rate: conversionRate,
                currency,
                amount
            },
            split: {
                eth: ethToSplit,
                wei: weiToSplit.toString()
            },
            tx
        });
});

module.exports = splitter;
