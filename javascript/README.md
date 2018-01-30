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

-> the blockchain receives a new block what to do ?

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

# Use Case

Use cases:

As a node,
	it receives a new transaction.
	it creates the block and insert it in the chain
	it mines the block
	it broadcasts the new block to the nodes of the network

As a node
	It receives a new block
	It checks the index of the block
	Si l'index est plus grand, je ne peux pas l'ajouter
		ma chaine n'est pas a jour.
		Je lance une demande pour récuperer la chaine la plus longue du network.

	Si l'index est inférieur, je ne fais rien
		je met un message block non valide.

	Si l'index suit mon lastIndex, je l'ajoute
		je lance une validation de toute  ma chaine.

As a node
  It receives a sendBlocks request
  It sends all its blocks

As a node
  it receives a new blocks chain
  it builds a blockchain object out of the list
  it validates the new blockchain is valid
  if the length is higer than the existing one it becomes the offcial blockchain
