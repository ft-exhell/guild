import React, { useState, useEffect } from "react";
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import Balancer from '../contracts/Balancer.json'
import USDC from '../contracts/USDC.json'
import DAI from '../contracts/DAI.json'
import Vault from '../contracts/Vault.json'

const BalTrade = () => {
    const [web3, setWeb3] = useState(undefined)
    const [account, setAccount] = useState(undefined);
    const [ethBalance, setEthBalance] = useState(0)
    const [daiBalance, setDAIBalance] = useState(0)
    const [usdcBalance, setUsdcBalance] = useState(0)
    const [usdcInstance, setUsdcInstance] = useState(undefined)
    const [balInstance, setBalInstance] = useState(undefined)

    const connectionHandler = async () => {
        if(window.ethereum) {
            const web3 = new Web3(Web3.givenProvider)

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
            const account = accounts[0]

            const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
            const daiInstance = new web3.eth.Contract(DAI, daiAddress);

            const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
            const usdcInstance = new web3.eth.Contract(USDC, usdcAddress)

            const ethBalance = await web3.eth.getBalance(account) / 1e+18
            const daiBalance = await daiInstance.methods.balanceOf(account).call() / 1e+18
            const usdcBalance = await usdcInstance.methods.balanceOf(account).call() / 1e+6

            const balAddress = '0xBA12222222228d8Ba445958a75a0704d566BF2C8'
            const balInstance = new web3.eth.Contract(Balancer, balAddress);

            setWeb3(web3)
            setAccount(account)
            setEthBalance(ethBalance)
            setUsdcBalance(usdcBalance)
            setUsdcInstance(usdcInstance)
            setBalInstance(balInstance)
            setDAIBalance(daiBalance)
        }
    }

    useEffect(() => {

    }, [])

    const swapEthToUsdc = async () => {

        const hexBatchSwap = '0x945bcec9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000300000000000000000000000000430d6bB7Bcd12Cfa77589A7B826B12321A8815930000000000000000000000000000000000000000000000000000000000000000000000000000000000000000430d6bB7Bcd12Cfa77589A7B826B12321A88159300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000380ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000010029d7a7e0d781c957696697b94d4bc18c651e358e0002000000000000000000490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000006f05b59d3b2000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000005d6e3d7632d6719e04ca162be652164bec1eaa6b00020000000000000000004800000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000000000000000000000000000068037790a0229e9ce6eaa8a99ea92964106c4703000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000006f05b59d3b200000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf0ce3ad'
        const tx = {
            from: account,
            to: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
            gasLimit: web3.utils.toHex('2000000'),
            gasPrice: web3.utils.toHex(web3.utils.toWei('2', 'gwei')),
            gas: web3.utils.toHex('1000000'),
            value: web3.utils.toHex(web3.utils.toWei('0.5', 'ether')),
            data: hexBatchSwap
        }
        await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [tx],
        });
    }

    const approveUSDC = async () => {
        const balAddress = '0xBA12222222228d8Ba445958a75a0704d566BF2C8';

        const approveUSDCCall = usdcInstance.methods.approve(balAddress, '1000000000000000000000');

        const tx = {
            from: account,
            to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            gas: web3.utils.toHex('2000000'),
            gasFee: web3.utils.toHex(web3.utils.toWei('2', 'gwei')),
            data: approveUSDCCall.encodeABI()
        }

        await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [tx]
        })
    }

    const swapUSDCtoDAI = async () => {

        const balAddress ='0xBA12222222228d8Ba445958a75a0704d566BF2C8';

        const fundSettings = {
            'sender': account,
            'recipient': account,
            'fromInternalBalance': false,
            'toInternalBalance': false
        };

        const deadline = BigNumber(999999999999999999).toString();

        const poolStables = '0x06df3b2bbb68adc8b0e302443692037ed9f91b42000000000000000000000063';

        const usdc = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
        const dai = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
        
        const tokenData = {};

        tokenData[usdc] = {
            'symbol': 'USDC',
            'decimals': '6',
            'limit': '1000'
        };

        tokenData[dai] = {
            'symbol': 'DAI',
            'decimals': '18',
            'limit': '999'
        };

        const swap ={
            'poolId': poolStables,
            'assetIn': usdc,
            'assetOut': dai,
            'amount': 1000
        };

        const swapKind = 0;

        const swapStruct = {
            poolId: swap['poolId'],
            kind: swapKind,
            assetIn: web3.utils.toChecksumAddress(usdc),
            assetOut: web3.utils.toChecksumAddress(dai),
            amount: BigNumber(swap['amount'] * Math.pow(10, tokenData[swap['assetIn']]['decimals'])).toString(),
            userData: '0x'
        }

        const fundStruct = {
            sender: web3.utils.toChecksumAddress(account),
            fromInternalBalance: fundSettings['fromInternalBalance'],
            recipient: web3.utils.toChecksumAddress(account),
            toInternalBalance: fundSettings['toInternalBalance']
        }

        const tokenLimit = BigNumber((tokenData[swap["assetOut"]]["limit"]) * Math.pow(10, tokenData[swap["assetOut"]]["decimals"])).toFixed();

        const singleSwapCall = balInstance.methods.swap(
            swapStruct,
            fundStruct,
            tokenLimit,
            deadline
        )

        const tx = {
            from: account,
            to: balAddress,
            gas: web3.utils.toHex('2000000'),
            gasPrice: web3.utils.toHex(web3.utils.toWei('2', 'gwei')),
            value: web3.utils.toHex('0'),
            data: singleSwapCall.encodeABI()
        }

        await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [tx]
        })
    }

    const swapUSDCtoGUILD = async () => {

        const balAddress = '0xBA12222222228d8Ba445958a75a0704d566BF2C8';

        const fundStruct = {
            sender: web3.utils.toChecksumAddress(account),
            fromInternalBalance: false,
            recipient: web3.utils.toChecksumAddress(account),
            toInternalBalance: false
        }

        const deadline = BigNumber(999999999999999999).toString();

        const poolGUILD = '0x4ddf308520864ecfc759c49e72acfc96c023ed900002000000000000000000e1';

        const usdc = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
        const guild = '0x83E9F223e1edb3486F876EE888d76bFba26c475A';
        
        const tokenData = {};

        tokenData[usdc] = {
            'symbol': 'USDC',
            'decimals': '6',
            'limit': '104000'
        };

        tokenData[guild] = {
            'symbol': 'GUILD',
            'decimals': '18',
            'limit': '52000'
        };

        const swapKind = 0;
        const amount = 104000

        const swapStruct = {
            poolId: poolGUILD,
            kind: swapKind,
            assetIn: web3.utils.toChecksumAddress(usdc),
            assetOut: web3.utils.toChecksumAddress(guild),
            amount: BigNumber(amount * Math.pow(10, tokenData[usdc]['decimals'])).toString(),
            userData: '0x'
        }

        const tokenLimit = BigNumber((tokenData[guild]["limit"]) * Math.pow(10, tokenData[guild]["decimals"])).toFixed();

        const singleSwapCall = balInstance.methods.swap(
            swapStruct,
            fundStruct,
            tokenLimit,
            deadline
        )

        const tx = {
            from: account,
            to: balAddress,
            gas: web3.utils.toHex('200000'),
            maxFeePerGas: web3.utils.toHex(web3.utils.toWei('500', 'gwei')),
            maxPriorityFeePerGas: web3.utils.toHex(web3.utils.toWei('500', 'gwei')),
            value: web3.utils.toHex('0'),
            data: singleSwapCall.encodeABI()
        }

        await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [tx]
        })
    }

    return(
        <div>
            <button onClick={connectionHandler}>Connect Metamask</button>
            <h3>Account: {account ? `${account}` : 'Connect Wallet'}</h3>
            <p>{`ETH balance: ${ethBalance}`}</p>
            <p>{`USDC balance: ${usdcBalance}`}</p>
            <p>{`DAI balance: ${daiBalance}`}</p>
            {/* {account && <button onClick={swapEthToUsdc}>Swap ETH to USDC</button>} */}
            {account && <button onClick={approveUSDC}>Approve USDC</button>}
            {/* {account && <button onClick={swapUSDCtoDAI}>Swap USDC to DAI</button>} */}
            {account && <button onClick={swapUSDCtoGUILD}>Swap USDC to GUILD</button>}
        </div>
    )
}

export default BalTrade;