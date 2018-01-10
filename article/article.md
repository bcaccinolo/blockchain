
# Article

## Qu'est ce qu'une blockchain?

La blockchain est une liste complète de tous les blocs de transactions complétés depuis le début du Bitcoin par exemple.
Afin de renforcer la sécurité du système, la blockchain a été conçue de sorte que chaque bloc de transactions contienne
le hash produit à partir du bloc précédent.
La blockchain est une technologie de stockage et de transmission d’informations à faible coût, sécurisée, transparente,
et fonctionnant sans organe central de contrôle.
Par extension, la blockchain désigne une base de données sécurisée et distribuée (car partagée par ses différents utilisateurs),
contenant un ensemble de transactions dont chacun peut vérifier la validité.
La blockchain peut donc être comparée à un grand livre comptable public, anonyme et infalsifiable.


## Structure d'un bloc

Commençons par définir la structure d'un bloc. Seulement les parties essentielles sont ajoutées dans un bloc pour l'instant:

 - index: la position du bloc dans la chaîne
 - date: date de création du bloc
 - data: les données à stocker (exemple: liste de transactions)
 - hash: a SHA256 hash généré à partir des données contenues dans le bloc
 - previousHash: le hash du bloc précédent

> ici le schéma de la blockchain...

Ce qui donne le bloc suivant:

```javascript

class Block {

  constructor(id, date, data, previousHash, hash) {
    this.id = id;
    this.date = date;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = hash;
  }
}

```
## Génération du hash

Le hash d'un bloc est sa partie la plus importante, il garantie que le bloc est valide.
Le hash est calculé à partir de toutes les données contenues dans le bloc.
Cela signifie que si une donnée est modifiée dans le bloc, le hash n'est plus valide.
Le hash peut être vu comme l'identifiant unique d'un bloc.
Il est possible de trouver 2 blocs avec le même ID, en cas de conflit, mais ils auront
un hash différent.

Pour calculer le hash d'un bloc, nous utiliserons la librairie CryptoJS https://www.npmjs.com/package/crypto-js.

```javascript
var SHA256 = require("crypto-js/sha256");

calculateHash() {
    return SHA256(this.id + this.date + this.date + this.previousHash).toString();
}
```

Notons que pour un bloc donné, le hash du bloc précédent est utlisé pour le calcul du hash.
Cela signifie que si un bloc est modifié, il faut recalculer son hash ainsi que le hash de
tous les blocs suivants.

Attention, pour le moment, le hash n'est pas utilisé pour faire ce que l'on appelle du 'minage'.
Le hash est utilisé pour garantir l'intégrité du bloc.

Dans l'exemple suivant, si les données du bloc 0 sont modifiées, son hash change ainsi que celui de
tous les blocs suivants.

>> ajouté ici l'image blockchain update


# La blockchain

## Le premier bloc

Le premir bloc d'une blockchain est appelé GenesisBlock, c'est le seul bloc de la chaîne à ne pas
posséder de previousHash. Il sera créé avec le code suivant:

```javascript
genesisBlock = new Block(0, null, "Genesis Block", null);
```

La méthode calculateHash génére alors le hash du 1er bloc qui sera utilisé pour l'ajout du bloc
suivant.

```
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

## Création d'un bloc

Pour générer un nouveau bloc, il nous faut connaître le hash du bloc précédent.
La partie data est fournie par l'utilisateur le reste est générer comme suit:

```javascript
generateNextBlock(blockData) {
    previousBlock = getLatestBlock();
    nextIndex = previousBlock.index + 1;
    nextDate = new Date().getTime() / 1000;
    nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
    newBlock = new Block(nextIndex, nextHash, previousBlock.hash, nextTimestamp, blockData);
    return newBlock;
}
```

## Stockage de la blockchain

Pour l'instant, les blocs seront stockés dans un simple tableau, les données ne seront pas persistantes.

``` javascript
createGenesisBlock() {
    this.blocks.push(new Block(0, null, "Genesis Block", null));
}
```

## La validation des blocs

A tout moment, il doit être possible de valider l'intégrité d'un bloc ou d'un ensemble de blocs.
Pour qu'un bloc soit valide, il faut qu'il valide les règles suivantes:

 - L'index du bloc doit suivre l'index du bloc précédent
 - le previousHash correspond bien au hash du bloc précédent
 - le hash du bloc est valide

 Pour faire cela voici le code:

```javascript
  isValidNewBlock(newBlock, previousBlock) {
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('invalid index');
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('invalid previoushash');
        return false;
    } else if (newBlock.calculateHash() !== newBlock.hash) {
        console.log(typeof (newBlock.hash) + ' ' + typeof newBlock.calculateHash());
        console.log('invalid hash: ' + newBlock.calculateHash() + ' ' + newBlock.hash);
        return false;
    }
    return true;
  }
```

Pour valider le bloc Genesis, les règles sont les mêmes sauf que le previousHash doit
être `null`.

```javascript
  isValidGenesisBlock() {
    genesisBlock = this.blocks[0];

    if (genesisBlock.index === 0) {
        console.log('invalid index');
        return false;
    } else if (genesisBlock.previousHash === null) {
        console.log('invalid previoushash');
        return false;
    } else if (genesisBlock.calculateHash() !== genesisBlock.hash) {
        console.log('invalid hash: ' + genesisBlock.calculateHash() + ' ' + genesisBlock.hash);
        return false;
    }
    return true;
  }
```

Maintenant que nous savons comment valider un bloc, il est possible de valider tout
une blockchain. Dans un premier temps, il faut valider que le bloc Genesis est valide
puis il valider tous les blocs suivant. Voici le code pour faire cela:

```javascript
const isValidChain = (blockchainToValidate: Block[]): boolean => {
    const isValidGenesis = (block: Block): boolean => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };

    if (!isValidGenesis(blockchainToValidate[0])) {
        return false;
    }

    for (let i = 1; i < blockchainToValidate.length; i++) {
        if (!isValidNewBlock(blockchainToValidate[i], blockchainToValidate[i - 1])) {
            return false;
        }
    }
    return true;
};
```


# Le minage

La validation des transactions dans un réseau de blockchains est un processus complexe.
Une des briques principales permettant cette validation est ce que l'on appelle le 'Proof of Work'.
Il s'agit d'un puzzle à résoudre avant de pouvoir ajouter un block à la blockchain.
La résolution de ce puzzle est ce qui s'appelle 'miner'.

Le 'Proof of Work' est une protection pour éviter que les mineurs soient tentés de tricher
en ajoutant des blocs frauduleux.
Pour un mineur, le fait de miner un bloc lui coûte en électricité et s'il triche, ce sera
de l'argent perdu. Alors que s'il ne triche pas, il sera récompenser s'il ne triche et s'il
transmet un bloc valide.

Comment implémenter le 'Proof of Work'?

Un des puzzles les plus répandu est le fait de trouver un hash valide pour le bloc débutant
par un certain nombre de zéro suivant la difficulté souhaitée.
Pour pouvoir modifier le hash, un compteur va être ajouté dans le bloc.
Ce compteur est appelé 'nonce'.
En itérant sur le 'nonce' nous modifions le hash jusqu'à tomber sur un hash débutant par
le nombre de zéros souhaité.
L'inttérêt est que le puzzle est compliqué à trouver mais il est très simple à valider.

Une méhode va être ajoutée à la classe 'Block' pour faire cela:

```javascript
  solveProofOfWork(difficulty = 4) {
    this.nonce = 0;
    while (true) {
        this.hash = this.calculateHash();
        let puzzlePart = this.hash.slice(0, difficulty);

        if (puzzlePart === Array(difficulty + 1).join('0')) {
            console.log(this);
            return true;
        }
        this.nonce = this.nonce + 1;
    }
  }
```

L'intégratlité du code est disponible sur Github. < lien


# Conclusion

J'espère que cette implémentation vous aura plu.
Si vous souhaitez que cette article est une suite mettez des '+' commentaire !
