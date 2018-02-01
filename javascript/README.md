# blockchain.js

A blockchain in javascript with the implementation of a the Proof of Work (PoW) & the implementation of the Consensus.

It uses WebSockets to communicate with the other blockchains of its network.

# It allors you to

- /listBlocks : display the blocks of the blockchain.

- /addTransaction : create a block containing a transaction. Once created, the new block is broadcasted to the other blockchains.

- /isBockchainValid : iterates through the blocks & validates the hash of blocks.

- /addPeer : add a new blockchain to the network.

- /listPeers : list all the registered blockchains of the network.

## Todo

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
