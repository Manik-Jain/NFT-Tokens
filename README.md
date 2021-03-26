# NFT-Tokens Management and Interaction API

This API allows for easy deployment and management of NFT Tokens, using Rinkeby and Infura.
Please refer to the .env.sample file and provide the required values to begin with. The minimum values required are as under:

1. DEPLOYER
2. INFURA_URL
3. INFURA_WSS_URL
4. PRIVATE_KEY
5. name
6. symbol

Make sure to rename the file to .env
Once the values are provided, please execute the following : 

`
node deploy
`

This command will run a local instance of the API to interact with Rinkeby Blockchain utilising Infura.

In order to deploy the contract, please execute in browser => @[http://localhost:3000/deploy]. This will return the address of contract being deployed.

Once you have the address, please provide it to the .env file.
After this we can perform the followoing operations:

1. Mint new token by providing the fees => http://localhost:3000/mint
  - The Ethers being passed will be help by the smart contract

2. Check balance of the ethers held by the contract => http://localhost:3000/balance

3. Check tokens held by the owner => http://localhost:3000/tokens/0xc7ec76A581a0D6BFc8C56f3982A2D8543E25191A
