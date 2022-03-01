const crypto = require('crypto');

module.exports = class Blockchain {
    constructor(leadingZero) {
        this.leadingZero = leadingZero
        this.chain = []
        this.createBlock(1, '0')
    }

    createBlock(proof, previousHash) {
        const block = {
            index: this.chain.length + 1,
            timestamp: Date.now().toString(),
            proof,
            previousHash
        }

        this.chain.push(block)

        return block
    }

    getPreviousBlock() {
        return this.chain[this.chain.length - 1]
    }

    proofOfWork(previousProof) {
        let newProof = 1
        let checkProof = false

        while (checkProof === false) {
            const difProof = (newProof ** 2) - (previousProof ** 2)
            const hashOperation = crypto.createHash('sha256').update(difProof.toString()).digest('hex')

            if (hashOperation.slice(0, this.leadingZero) === '0'.repeat(this.leadingZero)) {
                checkProof = true
            }
            else newProof += 1
        }

        return newProof
    }

    hash(block) {
        const stringifiedBlock = JSON.stringify(block)
        return crypto.createHash('sha256').update(stringifiedBlock).digest('hex')
    }

    isValidBlock(chain) {
        let previousBlock = chain[0]

        chain.forEach((block, idx) => {
            const difProof = (block.proof ** 2) - (previousBlock.proof ** 2)
            const hashOperation = crypto.createHash('sha256').update(difProof.toString()).digest('hex')

            if (block.previousHash !== this.hash(previousBlock)) return false

            if (hashOperation.slice(0, this.leadingZero) !== '0'.repeat(this.leadingZero)) return false

            previousBlock = block
        })

        return true
    }
}