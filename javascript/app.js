const { BlockChain } = require('./blockchain')
const { P2P } = require('./p2p')

// Command line: Connection ports
const wsServerPort = process.argv[2]
const webServerPort = Number(wsServerPort) + 1

const app = require('express')()
app.set('views', './views')
app.set('view engine', 'ejs')

const p2p = new P2P(wsServerPort)
p2p.createServer()

const blockchain = new BlockChain()
blockchain.p2p = p2p

// Webservices messages for the Blockchain

// A node requests the blocks of another node
p2p.messageFunctions['sendBlocks'] = function(json, ws) {
  ws.send(this.p2p.createMessage({type: 'requestedBlocks', data: this.blocks}))
}.bind(blockchain)

// A node receives all the blocks from another node to perform the consensus algorithm
p2p.messageFunctions['requestedBlocks'] = function(json, ws) {
  this.resolveConsensus(json.data)
}.bind(blockchain)

// A node sends the new block it has generated
p2p.messageFunctions['newBlock'] = function(json, ws) {
  this.addNewBlock(json.data)
}.bind(blockchain)

// End Webservices messages

app.get('/', (req, res) => {
  const urls = [ '/listBlocks', '/addTransaction', '/isBockchainValid', '/addPeer', '/listPeers' ]
  res.render('index', { urls: urls })
})

app.get('/listBlocks', (req, res) => {
  res.render('listBlocks', { blocks: blockchain.blocks })
})

app.get('/addTransaction', (req, res) => {
  const paramLength = Object.keys(req.query).length
  if (paramLength === 0) {
    res.render('addTransaction', { blocks: blockchain.blocks })
  } else {
    const transaction = req.query
    blockchain.blocks.push(blockchain.generateNextBlock(transaction))
    p2p.broadcast(p2p.createMessage({ type: 'newBlock', data: blockchain.getLastBlock() }))
    res.render('listBlocks', { blocks: blockchain.blocks })
  }
})

app.get('/isBockchainValid', (req, res) => {
  res.render('isBlockchainValid', { validity: blockchain.isValidChain() })
})

app.get('/addPeer', function(req, res) {
  const paramLength = Object.keys(req.query).length
  if (paramLength === 0) {
    res.render('addPeer')
  } else {
    p2p.newConnection(req.query.port)
    res.render('addPeer')
  }
})

app.get('/listPeers', function(req, res) {
  res.render('listPeers', { urls: p2p.listPeers() })
})

app.listen(webServerPort)
console.log('Web server listening http://localhost:' + webServerPort)
