const { Block } =  require('./block')
const { BlockChain } = require('./blockchain')

const app = require('express')()
app.set('views', './views')
app.set('view engine', 'ejs')

// Connection ports
const ws_server_port = process.argv[2]
const web_server_port = Number(ws_server_port) + 1

// Blockchain initialization
var blockchain = new BlockChain();
blockchain.blocks.push(blockchain.generateNextBlock({transfert: 100}));
blockchain.blocks.push(blockchain.generateNextBlock({transfert: 20}));

app.get('/', (req, res) => {
  console.log(app._router.stack);
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

app.get('/listBlocks', (req, res) => {
  res.render('listBlocks', { blocks: blockchain.blocks })
})

app.get('/addTransaction', (req, res) => {
  console.log(req.query);

  const param_length = Object.keys(req.query).length;
  if (param_length === 0) {
    res.render('addTransaction', { blocks: blockchain.blocks })
  } else {
    console.log(req.query);
    const transaction = req.query;
    blockchain.blocks.push(blockchain.generateNextBlock(transaction));
    res.render('listBlocks', { blocks: blockchain.blocks })
  }
})

app.get('/isBockchainValid', (req, res) => {
  res.render('isBlockchainValid', { validity: blockchain.isValidChain() })
})

app.listen(web_server_port);
console.log("Web server listening http://localhost:" + web_server_port);

