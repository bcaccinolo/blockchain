var { Block } =  require('./block')

var BlockChain = class {

  constructor() {
    this.blocks = [];
    this.createGenesisBlock();
  }

  createGenesisBlock() {
    this.blocks.push(new Block(0, 0, "Genesis Block", null));
  }

  getLastBlock() {
    return this.blocks[this.blocks.length - 1];
  }

  generateNextBlock(blockData) {
    const previousBlock = this.getLastBlock();
    const nextIndex = previousBlock.index + 1;
    const nextDate = new Date().getTime();
    const newBlock = new Block(nextIndex, nextDate, blockData, previousBlock.hash);
    newBlock.solveProofOfWork();
    return newBlock;
  }

  addNewBlock(newBlock) {
    console.log('ready to add the new block');
    var lastBlock = this.getLastBlock();

    console.log('last block', lastBlock);
    console.log('new block', newBlock);

    var lastBlockIndex = parseInt(lastBlock.index);
    var newBlockIndex = parseInt(newBlock.index);

    console.log(newBlockIndex);
    console.log(lastBlockIndex + 1);

    if(newBlockIndex === lastBlockIndex + 1) {
      console.log('the index is ok we can insert it ');

      if (this.isValidNewBlock(newBlock, lastBlock)) {
        this.blocks.push(newBlock);
        console.log('new block added');
      }


    } else if(newBlockIndex > lastBlockIndex) {
      console.log('the index is too high, we need to refresh the blockchain');
    } else if(newBlockIndex < lastBlockIndex) {
      console.log('the index looks weird, I dont do anything');
    }
  }

  isValidNewBlock(newBlock, previousBlock) {
    if (previousBlock.index + 1 !== newBlock.index) {
      console.log('invalid index', newBlock);
      return false;
    }
    if (previousBlock.hash !== newBlock.previousHash) {
      console.log('invalid previoushash', newBlock);
      return false;
    }
    if (newBlock.calculateHash() !== newBlock.hash) {
      console.log('invalid hash: ' + newBlock.calculateHash() + ' ' + newBlock.hash);
      return false;
    }
    console.log('new block is valid');

    return true;
  }

  isValidGenesisBlock() {
    let genesisBlock = this.blocks[0];

    if (genesisBlock.index !== 0) {
      console.log('invalid index', genesisBlock);
      return false;
    }
    if (genesisBlock.previousHash !== null) {
      console.log('invalid previoushash', genesisBlock);
      return false;
    }
    if (genesisBlock.calculateHash() !== genesisBlock.hash) {
      console.log('invalid hash: ' + genesisBlock.calculateHash() + ' ' + genesisBlock.hash);
      return false;
    }
    return true;
  }

  isValidChain() {
    if (!this.isValidGenesisBlock(this.blocks[0])) {
      return false;
    }

    for (let i = 1; i < this.blocks.length; i++) {
      if (!this.isValidNewBlock(this.blocks[i], this.blocks[i - 1])) {
        return false;
      }
    }
    return true;
  }

  resolveConsensus(externalBlockchain) {
    console.log('resolving consensus');

    if (externalBlockchain.isValidChain() === false) {
      return false
    }

    var currentLength = this.blocks.length;
    var newLength = externalBlockchain.blocks.length;
    if (newLength > currentLength) {
      console.log('ok to replace');
      this.blocks = externalBlockchain.blocks;
    } else {
      console.log('we keep the existing one');
    }

  }

}

module.exports = { BlockChain }
