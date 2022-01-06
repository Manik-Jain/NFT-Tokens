import express from 'express';
import bodyParser from 'body-parser';
import Deployable from './deployable.js';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

const deployable = new Deployable();

app.get('/', (req, res) => {
    console.log(process.env.BYTECODE);
    res.send({'response' : 'app is running'});
})

//http://localhost:3000/deploy
app.get('/deploy', async (req, res) => {
    const contract = await deployable.deployContract();
    const message = contract ? `Contract deployed successfully at : ${contract.options.address}` : 'Contract deployment ran into error';
    res.send(message);
})

//http://localhost:3000/contract
app.get('/contract', async(req, res) => {
    const contract = await deployable.getContractInstance();
    res.send('ok');
})

//http://localhost:3000/mint
//req.rxr
app.post('/mint', async(req, res) => {
    req.rxr = '0x9870A642128Fe761722fFD0288987258122821aa'
    await deployable.mint(req);
    res.send('ok');
})

//http://localhost:3000/tokens/0xc7ec76A581a0D6BFc8C56f3982A2D8543E25191A
app.get('/tokens/:owner', async(req, res) => {
    const tokens = await deployable.tokensOf(req.params.owner);
    res.send({'Owner Tokens' : tokens});
})

//http://localhost:3000/mint
// app.get('/balance', async(req, res) => {
//     res.send({
//         'Contract Balance' : await contractBalance() 
//     });
// })

app.get('/details/:tokenId', async(req, res) => {
    const details = await deployable.tokenDetail(req.params.tokenId)
    res.send({'Details' : details})
})

app.listen(3001, () => {
    console.log('App listening on 3001');
})