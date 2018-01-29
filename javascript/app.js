const { Block } =  require('./block')
const { BlockChain } = require('./blockchain')
const { P2P } = require('./p2p')

// Command line: Connection ports
const ws_server_port = process.argv[2]
const web_server_port = Number(ws_server_port) + 1

const app = require('express')()
app.set('views', './views')
app.set('view engine', 'ejs')

const p2p = new P2P(ws_server_port)
p2p.createServer();

// Blockchain initialization
p2p.blockchain = new BlockChain();
p2p.blockchain.blocks.push(p2p.blockchain.generateNextBlock({transfert: 100}));
p2p.blockchain.blocks.push(p2p.blockchain.generateNextBlock({transfert: 20}));

app.get('/', (req, res) => {
  console.log(app._router.stack);
  const urls = [ '/listBlocks', '/addTransaction', '/isBockchainValid', '/addPeer', '/listPeers', '/peerBlocks' ]
  res.render('index', { urls: urls })
})

app.get('/listBlocks', (req, res) => {
  res.render('listBlocks', { blocks: p2p.blockchain.blocks })
})

app.get('/addTransaction', (req, res) => {
  console.log(req.query);

  const param_length = Object.keys(req.query).length;
  if (param_length === 0) {
    res.render('addTransaction', { blocks: p2p.blockchain.blocks })
  } else {
    console.log(req.query);
    const transaction = req.query;
    p2p.blockchain.blocks.push(p2p.blockchain.generateNextBlock(transaction));
    res.render('listBlocks', { blocks: p2p.blockchain.blocks })
  }
})

app.get('/isBockchainValid', (req, res) => {
  res.render('isBlockchainValid', { validity: p2p.blockchain.isValidChain() })
})

app.get('/addPeer', function(req, res) {
  const param_length = Object.keys(req.query).length;

  if (param_length === 0) {
    res.render('addPeer')
  } else {
    p2p.newConnection(req.query.port);
    res.render('addPeer')
  }
})

app.get('/listPeers', function(req, res) {
  let urls =  p2p.listPeers()
  res.render('listPeers', { urls: p2p.listPeers() })
})

app.get('/peerBlocks', function(req, res) {
  const param_length = Object.keys(req.query).length;

  if (param_length === 0) {
    res.render('addPeer')
  } else {
    res.render('addPeer')
  }
})

app.listen(web_server_port);
console.log("Web server listening http://localhost:" + web_server_port);

