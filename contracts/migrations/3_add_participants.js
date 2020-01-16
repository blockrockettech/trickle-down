const TrickleDownSplitter = artifacts.require('TrickleDownSplitter');

const participants = [
    '0x8Ba2BAc867245466AECD0484e3f7ABBaBD61b1Df',
    '0x18ac920241E0F5699448379e63069724D9d8a603',
    '0xCBE6669d969Acb5896b16bdAD0191f169F9C661B',
    '0x252037f30415DD6869e6456ef2a7d9Ce0b152Ba7',
    '0xB43d72b568c75130047BD6B6960fDA51BDB6FA66',
    '0xF263F58dB6d1feB85E79DBB2B1eA6e12c5a6b2C2',
    '0xaa1fb4dD515FA75f0D0F5f77c7F0DFE6cfe3dcF1',
    '0xE41b75D7b1B691845Dd0DDfaffdAc5F8beB7fD2a',
    '0x2b715e9DFC3943aEe35b093D87b530c339eE06E9',
    '0x818Ff73A5d881C27A945bE944973156C01141232',
    '0x818Ff73A5d881C27A945bE944973156C01141232',
    '0x314566a5878f04e105D7cAeA826DA4e3d5D4f567',
    '0xd04c007751b308688b31973c5ad505d3faa5dd2c',
    '0xb48386e64cafa289df58cef8709319049723c1f6',
    '0xfAE06A3f31e70B2AaE012E93a03539Ac4f7A1090',
    '0x5595595b3648f2450842F801bF75ba908BbF3331',
    '0xf247a7c06CcC535bE0B6736A1c30395e762c52B4',
    '0x2B1D2d290268cb4C4862d4a658f1C2A663C0F79a',
    '0x00812076E9460d60E7F9af956cBDA17Ac64eEAA2',
    '0x7a6617F00FbBA9793Ff6a1B15570ae98E5302ebA',
    '0xB20C870761AB197a1E677EEf42A15009bCD809Cb',
    '0x000acfa58Ab1c10Ce214D7cB324554cB46EeA7E6',
    '0x7CC2fD8F02DC0A41766Bc358c0D71f73eC4f4C63',
    '0x623A9BAab04596C550fcA7f64868Fb6BD2b734F1',
    '0x83C58787A2b79d516e5010F5B15CfAb4E5819fF7',
];


module.exports = async function (deployer, network, accounts) {
    console.log(`Adding participants to TrickleDownSplitter on [${network}]`);

    const creator = accounts[0];

    const splitter = await TrickleDownSplitter.deployed();
    console.log('splitter.address', splitter.address);

    await splitter.setParticipants(participants, { from: creator });
};