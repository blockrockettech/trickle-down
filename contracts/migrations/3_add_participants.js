const TrickleDownSplitter = artifacts.require('TrickleDownSplitter');
const participants = [
    "0x8Ba2BAc867245466AECD0484e3f7ABBaBD61b1Df",
    "0x18ac920241E0F5699448379e63069724D9d8a603",
    "0xCBE6669d969Acb5896b16bdAD0191f169F9C661B",
    "0xF263F58dB6d1feB85E79DBB2B1eA6e12c5a6b2C2",
    "0xaa1fb4dD515FA75f0D0F5f77c7F0DFE6cfe3dcF1",
    "0xE41b75D7b1B691845Dd0DDfaffdAc5F8beB7fD2a",
    "0x818Ff73A5d881C27A945bE944973156C01141232",
    "0x314566a5878f04e105D7cAeA826DA4e3d5D4f567",
    "0xb48386e64cafa289df58cef8709319049723c1f6",
    "0xfAE06A3f31e70B2AaE012E93a03539Ac4f7A1090",
    "0xf247a7c06CcC535bE0B6736A1c30395e762c52B4",
    "0x2B1D2d290268cb4C4862d4a658f1C2A663C0F79a",
    "0x00812076E9460d60E7F9af956cBDA17Ac64eEAA2",
    "0xB20C870761AB197a1E677EEf42A15009bCD809Cb",
    "0x000acfa58Ab1c10Ce214D7cB324554cB46EeA7E6",
    "0x7CC2fD8F02DC0A41766Bc358c0D71f73eC4f4C63",
    "0x12D062B19a2DF1920eb9FC28Bd6E9A7E936de4c2"
];

module.exports = async function (deployer, network, accounts) {
    console.log(`Adding participants to TrickleDownSplitter on [${network}]`);

    const creator = accounts[0];

    const splitter = await TrickleDownSplitter.deployed();
    console.log('splitter.address', splitter.address);

    await splitter.setParticipants(participants, { from: creator });
};
