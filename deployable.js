import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import HDWalletProvider from '@truffle/hdwallet-provider'; 
import NFTStore from './nft-storage.js'
import fetch from "node-fetch";
import axios from "axios"

//currently these are assumed to 17 zeroes, just to reduce the testing effort
const ether = new BigNumber(100000000000000000);

export default class Deployable {

    async deployContract() {
        const BYTECODE = process.env.BYTECODE;
        const DEPLOYER = process.env.DEPLOYER;
        const INFURA_URL = process.env.INFURA_URL;
        const INFURA_WSS_URL = process.env.INFURA_WSS_URL;
        const PRIVATE_KEY = process.env.PRIVATE_KEY;
        const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
        const name = process.env.name;
        const symbol = process.env.symbol;

        const deployableWeb3 = this.getWeb3Instance();
        var deployableContract = new deployableWeb3.eth.Contract(ABI);
        return deployableContract.deploy({
        data: BYTECODE, 
        arguments: [
            name,
            symbol,
            ''
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

    async getContractInstance() {
        const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
        const deployableWeb3 = await this.getWeb3Instance();
        console.log(deployableWeb3)

        const ABI = [
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_symbol",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "baseUri",
                        "type": "string"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "approved",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "operator",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "bool",
                        "name": "approved",
                        "type": "bool"
                    }
                ],
                "name": "ApprovalForAll",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "previousOwner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "message",
                        "type": "string"
                    }
                ],
                "name": "TOKEN_MINTED",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "message",
                        "type": "string"
                    }
                ],
                "name": "TOKEN_TRANSFERED",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "getApproved",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getTokenId",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "user",
                        "type": "address"
                    }
                ],
                "name": "getTokensOwnnedBy",
                "outputs": [
                    {
                        "internalType": "uint256[]",
                        "name": "",
                        "type": "uint256[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "operator",
                        "type": "address"
                    }
                ],
                "name": "isApprovedForAll",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "tokenUri",
                        "type": "string"
                    }
                ],
                "name": "mintToken",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "name",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "ownerOf",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "renounceOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "safeTransferFrom",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes",
                        "name": "_data",
                        "type": "bytes"
                    }
                ],
                "name": "safeTransferFrom",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "operator",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "approved",
                        "type": "bool"
                    }
                ],
                "name": "setApprovalForAll",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes4",
                        "name": "interfaceId",
                        "type": "bytes4"
                    }
                ],
                "name": "supportsInterface",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "symbol",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "tokenURI",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]

        const nftContract = await new deployableWeb3.eth.Contract(ABI, CONTRACT_ADDRESS);
        return nftContract;
    }

    async getEventInstance() {
        const BYTECODE = process.env.BYTECODE;
const DEPLOYER = process.env.DEPLOYER;
const INFURA_URL = process.env.INFURA_URL;
const INFURA_WSS_URL = process.env.INFURA_WSS_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const name = process.env.name;
const symbol = process.env.symbol;
        const deployableWeb3 = this.getEventWeb3();
        console.log(deployableWeb3)
        console.log(ABI)
        const nftContract = await new deployableWeb3.eth.Contract(ABI, CONTRACT_ADDRESS);
        return nftContract;
    }

    async getWeb3Instance() {
        const BYTECODE = process.env.BYTECODE;
const DEPLOYER = process.env.DEPLOYER;
const INFURA_URL = process.env.INFURA_URL;
const INFURA_WSS_URL = process.env.INFURA_WSS_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const name = process.env.name;
const symbol = process.env.symbol;
        const provider = new HDWalletProvider([PRIVATE_KEY], INFURA_URL);
        return new Web3(provider);
    }

    async getEventWeb3() {
        const BYTECODE = process.env.BYTECODE;
const DEPLOYER = process.env.DEPLOYER;
const INFURA_URL = process.env.INFURA_URL;
const INFURA_WSS_URL = process.env.INFURA_WSS_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const name = process.env.name;
const symbol = process.env.symbol;
        const provider = new HDWalletProvider([PRIVATE_KEY], INFURA_WSS_URL);
        return new Web3(provider);
    }

    async mint(req) {
        const DEPLOYER = process.env.DEPLOYER;
        const nftStore = new NFTStore()
        const tokenUrl = await nftStore.uploadToIpfs(req.body)
        console.log(tokenUrl);

        const nftContract = await this.getContractInstance();

        nftContract.methods.mintToken(req.rxr, tokenUrl.url).send({
            from : DEPLOYER
        }, () => {
            console.log('Waiting for transaction to be mined...');
        }).then((txn) => {
            console.log(`Transaction proceesed with id : ${txn.transactionHash}`);
            console.log('Transaction has been mined...')
        }).catch((error) => {
            console.log(error)
        });
    }

    async tokensOf(owner) {
        const DEPLOYER = process.env.DEPLOYER;
        const nftContract = await this.getContractInstance();
        return nftContract.methods.getTokensOwnnedBy(owner).call({from : DEPLOYER}).then(async (result) => {
            let tokenWithDetails = []

            for await (const token of result) {
                const uri = await this.tokenDetail(token)
                const tokenUri = uri.toString();
                const tokenUrl = `https://ipfs.io/${tokenUri.replace('ipfs://', 'ipfs/')}`

                const response = await axios.get(tokenUrl)

                    tokenWithDetails.push({ 
                        id : token,
                        uri : uri,
                        data : response.data
                    })
            }

            return tokenWithDetails;
        })
    }

    async tokenDetail(tokenId) {
        const nftContract = await this.getContractInstance();
        return nftContract.methods.tokenURI(tokenId).call().then((result) => {
            return result;
        })

    }

//     async contractBalance() {
//         const BYTECODE = process.env.BYTECODE;
// const DEPLOYER = process.env.DEPLOYER;
// const INFURA_URL = process.env.INFURA_URL;
// const INFURA_WSS_URL = process.env.INFURA_WSS_URL;
// const PRIVATE_KEY = process.env.PRIVATE_KEY;
// const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
// const name = process.env.name;
// const symbol = process.env.symbol;
//         const nftContract = await this.getContractInstance();
//         return nftContract.methods.contractBalance().call({
//             from : DEPLOYER
//         }).then((result) => {
//             return result;
//         })
//     }

}