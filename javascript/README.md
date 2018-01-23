# blockchain.js

## Todo

-> add /addBlock
  add the block to the existing blockchain

- add the /addPeer call
    app.post('/addPeer', (req, res) => {
        connectToPeers(req.body.peer);
        res.send();
    });

- add the /listPeers

- add 'get all blocks'
    app.get('/blocks', (req, res) => {
        res.send(getBlockchain());
    });


