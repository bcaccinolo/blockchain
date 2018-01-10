
var SHA256 = require("crypto-js/sha256");

class Block {

  constructor(index, timeStamp, data, previousHash, hash) {
    console.log('creation of a block');
    this.index = index;
    this.timeStamp = timeStamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(this.index + this.timeStamp + this.data + this.previousHash + this.nonce).toString();
  }

  solveProofOfWork(difficulty = 4) {
    this.nonce = 0;
    while (true) {
        this.hash = this.calculateHash();
        let valid = this.hash.slice(0, difficulty);

        if (valid === Array(difficulty + 1).join('0')) {
            console.log(this);
            return true;
        }
        this.nonce = this.nonce + 1;
    }
  }

}


class BlockChain {

  constructor() {
    this.blocks = [];
    this.createGenesisBlock();
  }

  createGenesisBlock() {
    let timeStamp = new Date().getTime();
    this.blocks.push(new Block(0, timeStamp, "Genesis Block", null));
  }

  getLatestBlock() {
    return this.blocks[this.blocks.length - 1];
  }

  generateNextBlock(blockData) {
    let previousBlock = this.getLatestBlock();
    let nextIndex = previousBlock.index + 1;
    let nextDate = new Date().getTime();
    let newBlock = new Block(nextIndex, nextDate, blockData, previousBlock.hash);
    return newBlock;
  }

  isValidNewBlock(newBlock, previousBlock) {
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('invalid index', newBlock);
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('invalid previoushash', newBlock);
        return false;
    } else if (newBlock.calculateHash() !== newBlock.hash) {
        console.log(typeof (newBlock.hash) + ' ' + typeof newBlock.calculateHash());
        console.log('invalid hash: ' + newBlock.calculateHash() + ' ' + newBlock.hash);
        return false;
    }
    return true;
  }

  isValidGenesisBlock() {
    let genesisBlock = this.blocks[0];

    if (genesisBlock.index === '0') {
        console.log('invalid index', genesisBlock);
        return false;
    } else if (genesisBlock.previousHash === 'null') {
        console.log('invalid previoushash', genesisBlock);
        return false;
    } else if (genesisBlock.calculateHash() !== genesisBlock.hash) {
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

}

blockchain = new BlockChain();

blockchain.blocks.push(blockchain.generateNextBlock({transfert: 100}));
blockchain.blocks.push(blockchain.generateNextBlock({transfert: 20}));

console.log(blockchain.blocks);
console.log(blockchain.isValidChain());

let block = blockchain.blocks[2];
block.solveProofOfWork();