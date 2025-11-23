import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abis from '../abis.json';
import addresses from '../addresses.json';

const Swap = ({ provider, signer, account }) => {
    const [amountA, setAmountA] = useState('');
    const [amountB, setAmountB] = useState('');
    const [balanceA, setBalanceA] = useState('0');
    const [balanceB, setBalanceB] = useState('0');

    const tokenA = new ethers.Contract(addresses.tokenA, abis.token, signer || provider);
    const tokenB = new ethers.Contract(addresses.tokenB, abis.token, signer || provider);
    const pair = new ethers.Contract(addresses.pair, abis.pair, signer || provider);

    useEffect(() => {
        if (account) {
            fetchBalances();
        }
    }, [account]);

    const fetchBalances = async () => {
        if (!account) return;
        const balA = await tokenA.balanceOf(account);
        const balB = await tokenB.balanceOf(account);
        setBalanceA(ethers.formatEther(balA));
        setBalanceB(ethers.formatEther(balB));
    };

    const handleSwap = async () => {
        if (!signer) return;
        try {
            const amountIn = ethers.parseEther(amountA);
            // Simple swap A -> B
            // Approve first
            await (await tokenA.approve(addresses.pair, amountIn)).wait();

            // Calculate expected output (simplified)
            // In real app, use router or query pair for reserves
            // For MVP, we just send to pair and call swap
            // But pair.swap requires us to send tokens first

            await (await tokenA.transfer(addresses.pair, amountIn)).wait();

            // We need to calculate amountOut. 
            // For MVP, let's just ask for 0 output (unsafe but works for test)
            // Or we can calculate it off-chain.
            // Let's just swap with 0 min output for now.
            // Wait, pair.swap(amount0Out, amount1Out, to)
            // We need to know which token is token0/token1

            const token0 = await pair.token0();
            const isTokenA0 = token0.toLowerCase() === addresses.tokenA.toLowerCase();

            // If we sent TokenA, we want TokenB out.
            // If TokenA is token0, we sent amount0In, we want amount1Out.

            // Let's get reserves
            const reserves = await pair.getReserves();
            const reserve0 = reserves[0];
            const reserve1 = reserves[1];

            let amountOut;
            if (isTokenA0) {
                // Input is token0
                // amount1Out = (amount0In * 997 * reserve1) / (reserve0 * 1000 + amount0In * 997)
                // Note: reserve0 here is BEFORE the swap but AFTER the transfer? 
                // No, getReserves returns stored reserves. 
                // We already transferred tokens, so balance0 is higher than reserve0.
                // The contract calculates amountIn based on balance - reserve.

                // Actually, we should use the router for this, but for MVP we interact with Pair directly.
                // We need to calculate amountOut based on reserves.

                const amountInWithFee = amountIn * 997n;
                const numerator = amountInWithFee * reserve1;
                const denominator = (reserve0 * 1000n) + amountInWithFee;
                amountOut = numerator / denominator;

                await (await pair.swap(0, amountOut, account)).wait();
            } else {
                // Input is token1
                const amountInWithFee = amountIn * 997n;
                const numerator = amountInWithFee * reserve0;
                const denominator = (reserve1 * 1000n) + amountInWithFee;
                amountOut = numerator / denominator;

                await (await pair.swap(amountOut, 0, account)).wait();
            }

            alert(`Swapped ${amountA} TokenA for ${ethers.formatEther(amountOut)} TokenB`);
            fetchBalances();
        } catch (error) {
            console.error("Swap failed:", error);
            alert("Swap failed: " + error.message);
        }
    };

    const mintTokens = async () => {
        if (!signer) return;
        // Mint some tokens for testing
        await (await tokenA.mint(account, ethers.parseEther("100"))).wait();
        await (await tokenB.mint(account, ethers.parseEther("100"))).wait();
        fetchBalances();
    };

    return (
        <div className="swap-container">
            <h2>Swap</h2>
            <div className="input-group">
                <label>Token A (Balance: {parseFloat(balanceA).toFixed(2)})</label>
                <input
                    type="number"
                    value={amountA}
                    onChange={(e) => setAmountA(e.target.value)}
                    placeholder="0.0"
                />
            </div>
            <div className="arrow">↓</div>
            <div className="input-group">
                <label>Token B (Balance: {parseFloat(balanceB).toFixed(2)})</label>
                <input
                    type="number"
                    value={amountB}
                    disabled
                    placeholder="Estimated output"
                />
            </div>
            <button onClick={handleSwap} disabled={!account || !amountA} className="btn-swap">
                Swap
            </button>
            <button onClick={mintTokens} className="btn-mint">
                Mint Test Tokens
            </button>
        </div>
    );
};

export default Swap;
