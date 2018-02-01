const WebSocket = require('ws')

// P2P class
class P2P {
  constructor(port) {
    this.port = port
    this.sockets = []
    this.messageFunctions = {
      'message': this.showMessage,
      'addMe': this.addMe.bind(this),
      'newPeer': this.newPeer.bind(this),
      'newPeerBroadcast': this.newPeerBroadcast.bind(this)
    }
  }

  createServer() {
    this.server = new WebSocket.Server({port: this.port})
    console.log('P2P: server listening on port ', this.port)

    this.server.on('connection', (ws) => {
      ws.on('message', (data) => {
        this.listenMessage(data, ws)
      })
    })
  }

  newConnection(port) {
    let url = 'ws://localhost:' + port
    let ws = new WebSocket(url)

    ws.on('open', () => {
      ws.send(this.createMessage({ type: 'newPeerBroadcast', port: this.port }))
      ws.on('message', (msg) => {
        this.listenMessage(msg, ws)
      })
    })
  }

  listPeers() {
    let urls = this.sockets.map((socket) => {
      return socket.url
    })
    return urls
  }

  addSocket(ws) {
    ws.send(this.createMessage({type: 'message', data: 'ok i added you'}))
    ws.on('close', () => {
      console.log('connection closed')
      this.removeSocket(ws)
    })
    this.sockets.push(ws)
  }

  removeSocket(ws) {
    const index = this.sockets.indexOf(ws)
    this.sockets.splice(index, 1)
  }

  createMessage(json) {
    json.from = this.port
    console.log('\n---------------------------------------------------------')
    console.log('Sending: ', json)
    return JSON.stringify(json)
  }

  // broadcasting message
  broadcast(jsonMessage) {
    this.sockets.forEach((socket) => {
      socket.send(jsonMessage)
    })
  }

  // ***************************************************
  // Message functions
  // ***************************************************

  // Received a message
  showMessage(json, ws) {
    console.log('Message from: ' + json.from + ' - ' + json.data)
  }

  // Add the peer
  addMe(json, ws) {
    this.addSocket(ws)
  }

  // Add New Peer without broadcasting
  newPeer(json, ws) {
    let url = 'ws://localhost:' + json.port
    let newWs = new WebSocket(url)
    newWs.on('open', () => {
      newWs.send(this.createMessage({type: 'addMe', port: json.port}))
      newWs.on('message', (data) => {
        this.listenMessage(data)
      })
      this.addSocket(newWs)
    })
  }

  // New Peer Broadcast
  newPeerBroadcast(json, ws) {
    this.sockets.forEach((socket) => {
      socket.send(this.createMessage({type: 'newPeer', port: json.port}))
    })
    this.addSocket(ws)
    ws.send(this.createMessage({type: 'addMe', port: json.port}))
  }

  // ***************************************************
  // END Message functions
  // ***************************************************

  listenMessage(message, ws) {
    console.log('\n**********************************************************')
    console.log('Received message: ', message)
    const json = JSON.parse(message)

    ws.url = 'ws:://localhost:' + json.from
    console.log('the url is ', ws.url)

    const functions = this.messageFunctions
    const keys = Object.keys(functions)
    const index = keys.indexOf(json.type)
    if (index > 0) {
      functions[json.type](json, ws)
    }
  }
}
// End P2P class

module.exports = { P2P }
