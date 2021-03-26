require("dotenv").config("./env");
const BigNumber = require('bignumber.js');
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider'); 
const ABI = require('./abi.json');

const BYTECODE = process.env.BYTECODE;
const DEPLOYER = process.env.DEPLOYER;
const INFURA_URL = process.env.INFURA_URL;
const INFURA_WSS_URL = process.env.INFURA_WSS_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const name = process.env.name;
const symbol = process.env.symbol;

//currently these are assumed to 17 zeroes, just to reduce the testing effort
const ether = new BigNumber(100000000000000000);

const deployContract = async() => {
    const deployableWeb3 = getWeb3Instance();
    var deployableContract = new deployableWeb3.eth.Contract(ABI);
    return deployableContract.deploy({
     data: BYTECODE, 
     arguments: [
          name,
          symbol,
     ]
    }).send({
     from: DEPLOYER, 
     gas: '4700000'
   } , (e, contract) => {
        console.log('Transaction Hash : ', contract);
        if(e) {
            console.err(e);
        }
 }
 ).then(contract => {
     console.log('Contract details : ', contract);
     console.log(`Contract deployed at address : ${contract.options.address}`);
     return contract;
 }).catch((err) => {
    throw new Error(err);
})
}

const getContractInstance = async () => {
    const deployableWeb3 = getWeb3Instance();
    const nftContract = await new deployableWeb3.eth.Contract(ABI, CONTRACT_ADDRESS);
    return nftContract;
}

const getEventInstance = async() => {
    const deployableWeb3 = getEventWeb3();
    const nftContract = await new deployableWeb3.eth.Contract(ABI, CONTRACT_ADDRESS);
    return nftContract;
}

const getWeb3Instance = () => {
    const provider = new HDWalletProvider([PRIVATE_KEY], INFURA_URL);
    return new Web3(provider);
}

const getEventWeb3 = () => {
    const provider = new HDWalletProvider([PRIVATE_KEY], INFURA_WSS_URL);
    return new Web3(provider);
}

const mint = async () => {
    const nftContract = await getContractInstance();
    nftContract.methods.mint().send({
        from : DEPLOYER,
        value : ether
    }, () => {
        console.log('Waiting for transaction to be mined...');
    }).then((txn) => {
        console.log(`Transaction proceesed with id : ${txn.transactionHash}`);
        const tokenMintedEvent = txn.events.TOKEN_MINTED.returnValues;
        const tokenAmountCreditedEvent = txn.events.TOKEN_AMOUNT_CREDITED_FROM.returnValues;
        console.log(`Token Id : ${tokenMintedEvent.tokenId} minted to : ${tokenMintedEvent.to}`);
        console.log(`Token amount recieved from ${tokenAmountCreditedEvent.from} for token ${tokenAmountCreditedEvent.tokenId}`);
        console.log('Transaction has been mined...')
    }).catch((error) => {
        console.log(error)
    });

    console.log(nftContract.methods);
}

const tokensOf = async(owner) => {
    const nftContract = await getContractInstance();
    return nftContract.methods.tokensOf(owner).call().then((result) => {
        return result;
    })
}

const contractBalance = async () => {
    const nftContract = await getContractInstance();
    return nftContract.methods.contractBalance().call({
        from : DEPLOYER
    }).then((result) => {
        return result;
    })
}

module.exports = {
    deployContract, 
    getContractInstance,
    getEventInstance,
    mint,
    tokensOf,
    contractBalance
}