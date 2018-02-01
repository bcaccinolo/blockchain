const { Block } = require('./block')

const BlockChain = class {
  constructor() {
    this.blocks = []
    this.createGenesisBlock()
  }

  static fromJson(jsonBlocks) {
    const list = jsonBlocks.map((jsonBlock) => {
      return Block.fromJson(jsonBlock)
    })
    const blockchain = new BlockChain()
    blockchain.blocks = list
    return blockchain
  }

  createGenesisBlock() {
    this.blocks.push(new Block(0, 0, 'Genesis Block', null))
  }

  getLastBlock() {
    return this.blocks[this.blocks.length - 1]
  }

  generateNextBlock(blockData) {
    const previousBlock = this.getLastBlock()
    const nextIndex = previousBlock.index + 1
    const nextDate = new Date().getTime()
    const newBlock = new Block(nextIndex, nextDate, blockData, previousBlock.hash)
    newBlock.solveProofOfWork()
    return newBlock
  }

  isValidNewBlock(newBlock, previousBlock) {
    if (previousBlock.index + 1 !== newBlock.index) {
      console.log('invalid index', newBlock)
      return false
    }
    if (previousBlock.hash !== newBlock.previousHash) {
      console.log('invalid previoushash', newBlock)
      return false
    }
    if (newBlock.calculateHash() !== newBlock.hash) {
      console.log('invalid hash: ' + newBlock.calculateHash() + ' ' + newBlock.hash)
      return false
    }
    return true
  }

  isValidGenesisBlock() {
    let genesisBlock = this.blocks[0]

    if (genesisBlock.index !== 0) {
      console.log('invalid index', genesisBlock)
      return false
    }
    if (genesisBlock.previousHash !== null) {
      console.log('invalid previoushash', genesisBlock)
      return false
    }
    if (genesisBlock.calculateHash() !== genesisBlock.hash) {
      console.log('invalid hash: ' + genesisBlock.calculateHash() + ' ' + genesisBlock.hash)
      return false
    }
    return true
  }

  isValidChain() {
    if (!this.isValidGenesisBlock(this.blocks[0])) {
      return false
    }

    for (let i = 1; i < this.blocks.length; i++) {
      if (!this.isValidNewBlock(this.blocks[i], this.blocks[i - 1])) {
        return false
      }
    }
    return true
  }

  addNewBlock(jsonBlock) {
    const newBlock = Block.fromJson(jsonBlock)
    const lastBlock = this.getLastBlock()
    console.log('last block', lastBlock)
    console.log('new block', newBlock)

    const lastBlockIndex = parseInt(lastBlock.index)
    const newBlockIndex = parseInt(newBlock.index)
    console.log(newBlockIndex)
    console.log(lastBlockIndex + 1)

    if (newBlockIndex === lastBlockIndex + 1) {
      console.log('the index is ok we can insert it ')
      if (this.isValidNewBlock(newBlock, lastBlock)) {
        this.blocks.push(newBlock)
        console.log('new block added')
      }
    } else if (newBlockIndex > lastBlockIndex) {
      console.log('the index is too high, we need to refresh the blockchain')
      this.consensus()
    } else if (newBlockIndex < lastBlockIndex) {
      console.log('the index looks weird, I dont do anything')
    }
  }

  // Ask
  consensus() {
    this.p2p.sockets.forEach((socket) => {
      socket.send(this.p2p.createMessage({type: 'sendBlocks', data: ''}))
    })
  }

  resolveConsensus(blocksFromNode) {
    console.log('resolving consensus')
    const externalBlockchain = BlockChain.fromJson(blocksFromNode)

    if (externalBlockchain.isValidChain() === false) {
      return false
    }

    const currentLength = this.blocks.length
    const newLength = externalBlockchain.blocks.length
    if (newLength > currentLength) {
      console.log('ok to replace')
      this.blocks = externalBlockchain.blocks
    } else {
      console.log('we keep the existing one')
    }
  }
}

module.exports = { BlockChain }
