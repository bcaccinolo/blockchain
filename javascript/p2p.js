const WebSocket = require('ws');

// P2P class
class P2P {
  constructor(port) {
    this.port = port;
    this.sockets = [];
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
      console.log(socket);

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

  sendMessage(message) {
    this.sockets.forEach((socket) => {
      socket.send(this.createMessage({type: 'message', data: message}));
    })
  }

  listenMessage(message, ws) {
    console.log('\n**********************************************************');
    console.log('Received message: ', message);

    let json = JSON.parse(message);

    ws.url = "ws:://localhost:" + json.from
    console.log('the url is ', ws.url);


    // Return blocks
    if (json.type === 'sendBlocks') {
      ws.send(this.createMessage({type: 'message', data: 'sending blocks'}));
    }

    // New Peer Broadcast
    if (json.type === 'newPeerBroadcast') {
      this.sockets.forEach((socket) => {
        socket.send(this.createMessage({type: 'newPeer', port: json.port}));
      })
      this.addSocket(ws);
      ws.send(this.createMessage({type: 'addMe', port: json.port}));
    }

    // Add New Peer without broadcasting
    if (json.type === 'newPeer') {
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

    // Add the peer
    if (json.type === 'addMe') {
      this.addSocket(ws);
    }

    // Received a message
    if (json.type === 'message') {
      console.log("Message from: " + json.from + " - " + json.data);
    }
  }
}
// End P2P class

module.exports = { P2P }