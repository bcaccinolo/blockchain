const { Block } =  require('./block')
const { BlockChain } = require('./blockchain')

const app = require('express')()
app.set('views', './views')
app.set('view engine', 'ejs')

// Connection ports
const ws_server_port = process.argv[2]
const web_server_port = Number(ws_server_port) + 1

var blockchain = new BlockChain();

app.get('/', (req, res) => {
  console.log(app._router.stack);
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

app.get('/listBlocks', (req, res) => {
  res.render('listBlocks', { blocks: blockchain.blocks })
})

app.listen(web_server_port);
console.log("Web server listening http://localhost:" + web_server_port);







blockchain.blocks.push(blockchain.generateNextBlock({transfert: 100}));
blockchain.blocks.push(blockchain.generateNextBlock({transfert: 20}));

console.log(blockchain.blocks);
console.log(blockchain.isValidChain());

let block = blockchain.blocks[2];
block.solveProofOfWork();