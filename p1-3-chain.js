const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index,timestamp,data,previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index+ this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}


class BlockChain{
    constructor(){
        this.chain = [this.createGensisBlock()];
    }

    createGensisBlock(){
        return new Block(0,Date.now(),"Gensis block","0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
}

let myblockchain = new BlockChain();
myblockchain.addBlock(new Block(1, Date.now(), {amount : 5}));
myblockchain.addBlock(new Block(2, Date.now(), {amount : 10}));

console.log(myblockchain);