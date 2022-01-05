import {NFTStorage, File, Blob} from 'nft.storage';
import fs from 'fs';
import path from 'path';

export default class NFTStore {

    async uploadToIpfs(input) {
        const client = new NFTStorage(Object.freeze({ token: process.env.API_KEY}))

        const data = await fs.promises.readFile('./images/Emilio_naked.png')
        const metadata = await client.store({
            name: 'TreeTrunk',
            description: 'TreeTrunk sample Emilio_naked NFT!',
            image: new File([data], 'Emilio_naked.png', { type: 'image/png' })
        })

        return metadata
    }

}

// bored_trunk
// Token {
//     ipnft: 'bafyreicdxfvssfs7s6dftdkdtliyljm3kjh3dftldherm6uuc5z7n73zmy',
//     url: 'ipfs://bafyreicdxfvssfs7s6dftdkdtliyljm3kjh3dftldherm6uuc5z7n73zmy/metadata.json'
//   }

// Emilio_naked
// Token {
//     ipnft: 'bafyreiei6zvxi5ghsfbapwovpy57onlyre767cxbtbmurb4phg2ogsqlhy',
//     url: 'ipfs://bafyreiei6zvxi5ghsfbapwovpy57onlyre767cxbtbmurb4phg2ogsqlhy/metadata.json'
//   }