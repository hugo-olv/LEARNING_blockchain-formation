const express = require('express')
const app = express()
const port = 3000

const Blockchain = require('./blockchain')

const blockchain = new Blockchain(4)

app.get('/mine_block', (req, res) => {
    const previousBlock = blockchain.getPreviousBlock()
    const previousProof = previousBlock.proof
    const previousHash = blockchain.hash(previousBlock)
    const proof = blockchain.proofOfWork(previousProof)
    const block = blockchain.createBlock(proof, previousHash)

    const response = {
        message: 'Congratulations, you just mined a block!',
        ...block
    }

    res.status(200).json(response)
})

app.get('/get_chain', (req, res) => {

    const response = {
        //I add the current hash of each block to quickly compare with the previous hash of following blocks inside the response.
        chain: blockchain.chain.map(block => ({
            ...block,
            hash: blockchain.hash(block)
        })),
        length: blockchain.chain.length
    }

    res.status(200).json(response)
})

app.listen(port, () => {
    console.log(`Blockchain app listening on port ${port}`)
})