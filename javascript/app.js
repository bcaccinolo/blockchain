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
p2p.blockchain = new BlockChain();

app.get('/', (req, res) => {
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
    p2p.broadcast(p2p.createMessage({ type: 'newBlock', data: p2p.blockchain.getLastBlock() }))
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

// you request the blocks of a given peer
app.get('/peerBlocks', function(req, res) {
  const param_length = Object.keys(req.query).length;

  if (param_length !== 0) {
    var index = req.query.peerId;
    var socket = p2p.sockets[index];
    r = socket.send(p2p.createMessage({type: 'sendBlocks', data: "give me the blocks"}));

    console.log(r);

    res.render('peerBlocks')
  } else {
    res.render('peerBlocks')
  }
})

app.listen(web_server_port);
console.log("Web server listening http://localhost:" + web_server_port);

