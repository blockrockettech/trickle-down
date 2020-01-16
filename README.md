# trickle-down
API and Smart Contract Mono Repo

Directory Structure
=========

* [Smart Contracts](https://github.com/blockrockettech/trickle-down/tree/master/contracts)
* [Serverless API](https://github.com/blockrockettech/trickle-down/tree/master/api)


Smart Contract Makeup
========

* Contracts are deployed to `Ropsten` and `Mainnet`

* Addreses:
  * Ropsten - https://ropsten.etherscan.io/address/0x0BA2b2e2107CE768fB96c5Aa6d2973509c387218
  * Mainnet - TODO

##### Methods

* `addParticipant(address)` - add an address to split funds recipient list
* `removeParticipantAtIndex(address)` - remove the address from the split funds recipient
* `splitFunds(value)` - splits the value between the participants

API Method
========

* API is hosted here - `https://us-central1-trickle-down-6c7ca.cloudfunctions.net/api`
  * A header is required to invoked this API e.g. `X-Auth-Token: {SECRET_KEY}`
  * Without this header the API will return a error response.
  
* Network needs to be defined in the API e.g.
  * Ropsten = **3** e.g. `https://us-central1-trickle-down-6c7ca.cloudfunctions.net/api/network/3/`
  * Mainnet = **1** e.g. `https://us-central1-trickle-down-6c7ca.cloudfunctions.net/api/network/1/`

#### Get Balances

e.g. `curl --header "X-Auth-Token: {SECRET_KEY}" https://us-central1-trickle-down-6c7ca.cloudfunctions.net/api/network/3/splitter/balance`

Will return JSON containing the following payload:

* `{"api":"0.999941168 ETH","contract":"2.985955954545 ETH"}`

#### Split Funds

e.g.
```bash
curl -X POST \
   https://us-central1-trickle-down-6c7ca.cloudfunctions.net/api/network/3/splitter/split \
   -H 'Accept: application/json' \
   -H 'Content-Type: application/json' \
   -H 'X-Auth-Token: {SECRET_KEY}' \
   -d '{"amount": "1","currency": "gbp"}'
```

**POST** a payload with the amount and currency e.g. `{"amount": "1","currency": "gbp"}`

Will return JSON containing the following payload:

```json
{
    "conversion": {
        "rate": 144.62,
        "currency": "gbp",
        "amount": "1"
    },
    "split": {
        "eth": "0.00691467",
        "wei": "6914670000000000"
    },
    "tx": {
        "nonce": 127,
        "gasPrice": {
            "_hex": "0x3b9aca00"
        },
        "gasLimit": {
            "_hex": "0xe5d0"
        },
        "to": "0x0BA2b2e2107CE768fB96c5Aa6d2973509c387218",
        "value": {
            "_hex": "0x00"
        },
        "data": "0x2f1335cf000000000000000000000000000000000000000000000000001890db1116cc00",
        "chainId": 3,
        "v": 41,
        "r": "0x262796eef086ebd130b3a99b825c35c366a3d45be36fc060292968ba78992668",
        "s": "0x30234f6ad1a614c92cdd7742d24105f470b13d09a64e18866cb7ec486cf211d7",
        "from": "0x12D062B19a2DF1920eb9FC28Bd6E9A7E936de4c2",
        "hash": "0xeed6cc8177da05d4bd271aae5e7b1c0ffd8213105eae1baad0f577df01e28283"
    }
}
```

* `conversion` = the spot rate of the currency to 1 ETH
* `split` = the amount of ETH split between the participants
* `tx.hash` = the transaction hash of the submitted transaction onchain
