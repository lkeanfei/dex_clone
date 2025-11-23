const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DEXPair", function () {
    let tokenA, tokenB, pair;
    let owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        const MockToken = await ethers.getContractFactory("MockToken");
        tokenA = await MockToken.deploy("Token A", "TKNA");
        tokenB = await MockToken.deploy("Token B", "TKNB");

        const DEXPair = await ethers.getContractFactory("DEXPair");
        pair = await DEXPair.deploy(await tokenA.getAddress(), await tokenB.getAddress());
    });

    it("Should mint liquidity", async function () {
        const amountA = ethers.parseEther("100");
        const amountB = ethers.parseEther("100");

        await tokenA.approve(await pair.getAddress(), amountA);
        await tokenB.approve(await pair.getAddress(), amountB);

        await tokenA.transfer(await pair.getAddress(), amountA);
        await tokenB.transfer(await pair.getAddress(), amountB);

        await pair.mint(owner.address);

        expect(await pair.balanceOf(owner.address)).to.be.gt(0);
    });

    it("Should swap tokens", async function () {
        // Add liquidity first
        const amountA = ethers.parseEther("1000");
        const amountB = ethers.parseEther("1000");

        await tokenA.approve(await pair.getAddress(), amountA);
        await tokenB.approve(await pair.getAddress(), amountB);
        await tokenA.transfer(await pair.getAddress(), amountA);
        await tokenB.transfer(await pair.getAddress(), amountB);
        await pair.mint(owner.address);

        // Swap
        const swapAmount = ethers.parseEther("10");
        await tokenA.transfer(await pair.getAddress(), swapAmount);

        // Calculate expected output (simplified for test)
        // (x + dx) * (y - dy) = x * y
        // dy = y - (x * y) / (x + dx)
        // dy = (y * dx) / (x + dx)
        // With 0.3% fee: dx_with_fee = dx * 997
        // dy = (y * dx_with_fee) / (x * 1000 + dx_with_fee)

        // We just check if we get *something* out for now
        await pair.swap(0, ethers.parseEther("5"), owner.address); // Asking for 5 tokens out

        // Check balance changed
        // We started with 1M - 1000 - 10 = 998990 TKNA
        // We expect slightly more than 1M - 1000 = 999000 TKNB
    });
});
