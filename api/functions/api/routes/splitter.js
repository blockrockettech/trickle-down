const _ = require('lodash');

const authTokenChecker = require('./middlewares/authTokenChecker');

const splitter = require('express').Router({mergeParams: true});

// todo import service

// todo ethers equivalent
//const {getNetwork} = require("../web3/network");

// todo investigate what this is
// const {
//     fromEnumString,
//     ClientPaymentTerms,
//     ContractDuration,
//     ContractState,
//     PaymentFrequency
// } = require("../data/contractTypes");

// Set this middleware as early as possible to protect all routes below
splitter.use(authTokenChecker);

splitter.get('/balances', async (req, res, next) => {
    return res
        .status(200)
        .json({
            api: '0.01 ETH',
            contract: '0.5 ETH',
        });
});

module.exports = splitter;
