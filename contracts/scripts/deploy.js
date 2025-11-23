const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const MockToken = await hre.ethers.getContractFactory("MockToken");
    const tokenA = await MockToken.deploy("Token A", "TKNA");
    await tokenA.waitForDeployment();
    console.log("Token A deployed to:", await tokenA.getAddress());

    const tokenB = await MockToken.deploy("Token B", "TKNB");
    await tokenB.waitForDeployment();
    console.log("Token B deployed to:", await tokenB.getAddress());

    const DEXPair = await hre.ethers.getContractFactory("DEXPair");
    const pair = await DEXPair.deploy(await tokenA.getAddress(), await tokenB.getAddress());
    await pair.waitForDeployment();
    console.log("DEX Pair deployed to:", await pair.getAddress());

    const addresses = {
        tokenA: await tokenA.getAddress(),
        tokenB: await tokenB.getAddress(),
        pair: await pair.getAddress()
    };

    const fs = require("fs");
    const path = require("path");
    fs.writeFileSync(
        path.join(__dirname, "../../frontend/src/addresses.json"),
        JSON.stringify(addresses, null, 2)
    );
    console.log("Addresses saved to frontend/src/addresses.json");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
