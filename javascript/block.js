
var SHA256 = require("crypto-js/sha256");

var Block = class {
  constructor(index, timeStamp, data, previousHash) {
    this.index = index;
    this.timeStamp = timeStamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(this.index + this.timeStamp + this.data + this.previousHash + this.nonce).toString();
  }

  solveProofOfWork(difficulty = 4) {
    this.nonce = 0;
    while (true) {
      this.hash = this.calculateHash();
      const valid = this.hash.slice(0, difficulty);

      if (valid === Array(difficulty + 1).join('0')) {
        console.log(this);
        return true;
      }
      this.nonce++;
    }
  }
}

module.exports = { Block }
