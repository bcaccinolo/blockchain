# blockchain.js

## Todo

- DONE set the ExpressJS in place.

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

# In development

Install Nodeman (https://nodemon.io/)
```
npm install -g nodemon
```

```
nodemon app.js 3000
```

# Usage

```
node app.js 3000
```
