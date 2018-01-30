const WebSocket = require('ws')
const { Block } =  require('./block')
const { BlockChain } = require('./blockchain')

// P2P class
class P2P {
  constructor(port) {
    this.port = port;
    this.sockets = [];
    this.messageFunctions = {
      'sendBlocks': this.sendBlocks,
      'message': this.showMessage,
      'addMe': this.addMe.bind(this),
      'newPeer': this.newPeer.bind(this),
      'newPeerBroadcast': this.newPeerBroadcast.bind(this),
      // blockchain related
      'sendBlocks': this.sendBlocks,
      'requestedBlocks': this.requestedBlocks.bind(this),
      'newBlock': this.newBlock.bind(this)
    };
  }

  createServer() {
    this.server = new WebSocket.Server({port:this.port});
    console.log("P2P: server listening on port ", this.port);

    this.server.on('connection', (ws) => {
      ws.on('message', (data) => {
        this.listenMessage(data, ws);
      })
    })
  }

  newConnection(port) {
    let url = "ws://localhost:" + port;
    let ws = new WebSocket(url);

    ws.on('open', () => {
      ws.send(this.createMessage({ type: 'newPeerBroadcast', port: this.port }));
      ws.on('message', (msg) => {
        this.listenMessage(msg, ws);
      })
    });
  }

  listPeers() {
    let urls = this.sockets.map((socket) => {
      return socket.url
    })
    return urls
  }

  addSocket(ws) {
    ws.send(this.createMessage({type: 'message', data: "ok i added you"}));
    ws.on('close', () => {
      console.log('connection closed');
      this.removeSocket(ws);
    })
    this.sockets.push(ws);
  }

  removeSocket(ws) {
    const index = this.sockets.indexOf(ws);
    this.sockets.splice(index, 1);
  }

  createMessage(json) {
    json.from = this.port;
    console.log("\n---------------------------------------------------------");
    console.log("Sending: ", json);
    return JSON.stringify(json);
  }

  // broadcasting message
  broadcast(jsonMessage) {
    this.sockets.forEach((socket) => {
      socket.send(jsonMessage);
    })
  }

  //***************************************************
  // Message functions
  //***************************************************


  // Received a message
  showMessage(json, ws) {
    console.log("Message from: " + json.from + " - " + json.data);
  }

  // Add the peer
  addMe(json, ws) {
    this.addSocket(ws);
  }

  // Add New Peer without broadcasting
  newPeer(json, ws) {
    let url = "ws://localhost:"+json.port;
    let ws = new WebSocket(url);
    ws.on('open',  () => {
      ws.send(this.createMessage({type: 'addMe', port: json.port}));
      ws.on('message', (data) => {
        this.listenMessage(data);
      })
      this.addSocket(ws);
    })
  }

  // New Peer Broadcast
  newPeerBroadcast(json, ws)  {
    this.sockets.forEach((socket) => {
      socket.send(this.createMessage({type: 'newPeer', port: json.port}));
    })
    this.addSocket(ws);
    ws.send(this.createMessage({type: 'addMe', port: json.port}));
  }

  // Blockchain: send the blocks
  sendBlock(json, ws) {
    ws.send(this.createMessage({type: 'Blocks', data: this.blockchain.blocks}));
  }

  // Blockchain: you are receiving blocks from another peer
  requestedBlocks(json,ws) {
    var blocks = json.data;

    // TODO: create a Blockchain class method to do this.
    var list = blocks.map((block) => {
      var bl = new Block(block.index, block.timeStamp, block.data, block.previousHash);
      bl.nonce = block.nonce;
      bl.hash = bl.calculateHash();
      return bl;
    })
    console.log(list);

    var newBlockChain = new BlockChain();
    newBlockChain.blocks = list;
    console.log(newBlockChain.isValidChain());

    this.blockchain.resolveConsensus(newBlockChain);
  }

  // Blockchain: you are receiving one new generated block
  newBlock(json, ws) {
    console.log('new block received');

    // generating the new block
    var json_block = json.data;
    var block = new Block(json_block.index, json_block.timeStamp, json_block.data, json_block.previousHash);
    block.nonce = json_block.nonce;
    block.hash = block.calculateHash();

    var res = this.blockchain.addNewBlock(block);
    if (res === 3) {
      console.log('asking for consensus');
    }
  }
  //***************************************************
  // END Message functions
  //***************************************************

  listenMessage(message, ws) {
    console.log('\n**********************************************************');
    console.log('Received message: ', message);
    const json = JSON.parse(message);

    ws.url = "ws:://localhost:" + json.from
    console.log('the url is ', ws.url);

    const functions = this.messageFunctions;
    const keys = Object.keys(functions);
    const index = keys.indexOf(json.type);
    console.log(keys);
    console.log('.............', index, 'for key', json.type);
    if ( index > 0) {
      functions[json.type](json, ws)
    }
  }
}
// End P2P class

module.exports = { P2P }