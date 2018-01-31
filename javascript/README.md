# blockchain.js

https://github.com/websockets/ws/blob/master/doc/ws.md

https://github.com/websockets/ws

## Todo

- DONE set the ExpressJS in place.
- DONE list blocks
- DONE add /addTransaction
       add the block to the existing blockchain
- DONE add /isBlockChainValid
- DONE add the /addPeer using the P2P lib
- DONE add the /listPeers
- DONE in p2p.js. store the correct url info about the peers. We don't get all the data
       on the Server side.
- DONE get blocks from another peers
- DONE look at the consensus problem
- DONE what to do when I add a new block? Is it broadcasted?
- DONE adding a simple new block in best situation
- DONE the node ask to get all the existing chains to get the longest
- DONE REFACTO: factorize the message methods in app.js

- the p2p.js has been updated to it should be ported back to the p2pchat repo.

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
