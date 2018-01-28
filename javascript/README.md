# blockchain.js

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

-> get blocks from another peers
    >> update p2p.js directly addiing comment about the fact it coulb factorize.

-> look at the consensus problem

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
