const _ = require('lodash');

const authTokenChecker = require('./middlewares/authTokenChecker');

const contract = require('express').Router();

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
contract.use(authTokenChecker);

module.exports = contract;
