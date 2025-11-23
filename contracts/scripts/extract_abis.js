const fs = require('fs');
const path = require('path');

const pairArtifact = require('../artifacts/contracts/DEXPair.sol/DEXPair.json');
const tokenArtifact = require('../artifacts/contracts/MockToken.sol/MockToken.json');

const abis = {
    pair: pairArtifact.abi,
    token: tokenArtifact.abi
};

const outputPath = path.join(__dirname, '../../frontend/src/abis.json');
fs.writeFileSync(outputPath, JSON.stringify(abis, null, 2));
console.log(`ABIs extracted to ${outputPath}`);
