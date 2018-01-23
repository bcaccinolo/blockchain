var { Block } =  require('./block')
var { BlockChain } = require('./blockchain')

blockchain = new BlockChain();

blockchain.blocks.push(blockchain.generateNextBlock({transfert: 100}));
blockchain.blocks.push(blockchain.generateNextBlock({transfert: 20}));

console.log(blockchain.blocks);
console.log(blockchain.isValidChain());

let block = blockchain.blocks[2];
block.solveProofOfWork();