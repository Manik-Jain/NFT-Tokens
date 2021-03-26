const express = require('express');
const bodyParser= require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

const {
    deployContract : deployContract,
    getContractInstance : getContractInstance,
    mint : mint,
    tokensOf : tokensOf,
    contractBalance : contractBalance
} = require('./deployable.js');

app.get('/', (req, res) => {
    console.log(process.env.BYTECODE);
    res.send({'response' : 'app is running'});
})

//http://localhost:3000/deploy
app.get('/deploy', async (req, res) => {
    const contract = await deployContract();
    const message = contract ? `Contract deployed successfully at : ${contract.options.address}` : 'Contract deployment ran into error';
    res.send(message);
})

//http://localhost:3000/contract
app.get('/contract', async(req, res) => {
    const contract = await getContractInstance();
    res.send('ok');
})

//http://localhost:3000/mint
app.get('/mint', async(req, res) => {
    await mint();
    res.send('ok');
})

//http://localhost:3000/tokens/0xc7ec76A581a0D6BFc8C56f3982A2D8543E25191A
app.get('/tokens/:owner', async(req, res) => {
    const tokens = await tokensOf(req.params.owner);
    res.send({'Owner Tokens' : tokens});
})

//http://localhost:3000/mint
app.get('/balance', async(req, res) => {
    res.send({
        'Contract Balance' : await contractBalance() 
    });
})

app.listen(3000, () => {
    console.log('App listening on 3000');
})