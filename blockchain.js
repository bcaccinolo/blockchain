

class Block {

  constructor(id, date, data) {
    console.log('creation of a block');
    this.id = id;
    this.date = date;
    this.data = data;
  }

}

block = new Block(1, "12/12/12", "new block");

// console.log(block);


// this is a basic block for now.
// maintenant nous avons d'un moyen de valider les données.
// Ainsi si une données est modifiée, il est possible de vérifier la validité du block.
// Pour se faire nous allons mettre en place un Hash, Un hash, est une empreinte unique
// des données fournie en entrée.
// Ajoutons donc la propriété `hash` à notre block. Pour se faire, nous allons installer
// la librairie crypto-js pour cela.

// ```
// npm install --save crypto-js
// ```


// var SHA256 = require("crypto-js/sha256");

// class Block {

//   constructor(id, date, data) {
//     console.log('creation of a block');
//     this.id = id;
//     this.date = date;
//     this.data = data;
//     this.hash = this.generateHash();
//   }

//   generateHash() {
//     return SHA256(this.id + this.date + this.data ).toString();
//   }

//   isValid() {
//     return this.hash === this.generateHash();
//   }
// }


// ====================================

// Maintenant nous avons un block sécurisé en quelque sorte.

// Si une donnée est modifiée, il nous est possible de valider si le
// block est corrompu ou non. Pour se faier, nous avbons mis en place
// une fonction de lvalidation dqui va nous permietter de valider xu
// lel balock est validaett ou non.

// block = new Block(1, "12/12/12", "new block");
// console.log(block);
// console.log(block.isValid());

// // je le modifie
// block.date = "12/01/98";
// console.log(block);

// console.log(block.isValid());


// Maintenant que nous avons un block, il est temps de passer
// a la chaine...

// Pour se faire, chaque block contient le hash du block précédent.
// Il va donc falloir mettre à jour la structure de notre block pour recevroi
// la hash du block préc´dentt de la chaine.

var SHA256 = require("crypto-js/sha256");

class Block {

  constructor(id, date, data, previousHash) {
    console.log('creation of a block');
    this.id = id;
    this.date = date;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.generateHash();
  }

  generateHash() {
    return SHA256(this.id + this.date + this.data ).toString();
  }

  isValid() {
    return this.hash === this.generateHash();
  }
}

// Une chaine doit contenir un premier black appelé 'genesis'

class BlockChain {

  constructor() {
    this.blocks = [this.createGenesis()];
  }

  createGenesis() {
    return new Block(0, '01/01/01', {}, '');
  }

  addBlock(date, data) {
    var lastBlock = this.blocks[this.blocks.length - 1];
    var lastIndex = lastBlock.id;
    var lastHash = lastBlock.hash;
    var newBlock = new Block(lastIndex+1, date, data, lastHash);
    this.blocks.push(newBlock);
  }

}

chain = new BlockChain();

chain.addBlock('12/12/12', {transaction:100});
chain.addBlock('01/12/15', {transaction:100});

console.log(chain);
console.log(chain.blocks[1]);


// bien maintenant que se pase t il si un block est corrompu ?
// je me fais un versement 10 fois supérieur!

chain.blocks[1].data = {transaction:1000}

// que se passe-t-il si une donnée d'un bock est modifiée est qu'en plus
// le hash est recalculé ? on se retrouve avec un block valide !

// C'est là qu'arrive tout l'intéret d'avoir le hash du bloc
// précédent. Ainsi on peut le comparer et valider que ce derner est
// valide ou pas.

// Il faut donc mettre a jour la mehtode de calcul de validité en
// regardant le hash contenu dans le block suivant.



qu'est ce qu'on doit valider?

je ne sais plus en fait



## miner c'est quoi ?

c'est un système qui permet de valider que les données du


mettre en début une explication sur qu'est une blockchain? C'est un grand livre
comptable qui liste toutes les transactions faites dans un ordre chronologique.
la BlockChain sert à confirmer les transactions.

