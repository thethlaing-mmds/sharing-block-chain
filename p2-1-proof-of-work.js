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
        return SHA256(this.index+ this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
            this.hash = this.calculateHash();
        }
    }
}


class BlockChain{
    constructor(){
        this.chain = [this.createGensisBlock()];
        this.difficulty = 4;
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

    isChainValid(){
        for(let i=1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousHash = this.chain[i-1];
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            
            if(currentBlock.previousHash !== previousHash.hash){                
                return false;
            }
        }

        return true;
    }
}

let myblockchain = new BlockChain();
console.log("mining block 1...");
myblockchain.addBlock(new Block(1, Date.now(), {amount : 5}));
console.log("mining block 2...");
myblockchain.addBlock(new Block(2, Date.now(), {amount : 10}));