const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress,toAddress,amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp,transactions,previousHash = ''){
        this.timestamp = timestamp;
        this.transaction = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index+ this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        let mined_count = 0;
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
            mined_count++;            
        }

        console.log("Mined count " + mined_count);
        console.log("Block mined: " + this.hash);
    }
}


class BlockChain{
    constructor(){
        this.chain = [this.createGensisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGensisBlock(){
        return new Block(Date.now(),"Gensis block","0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    minePendingTransaction(miningRewardAddress){
        let block = new Block(Date.now(),this.pendingTransactions,this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined");
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null,miningRewardAddress,this.miningReward)
        ]
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transaction){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
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
myblockchain.createTransaction(new Transaction('address1','address2',100));
myblockchain.createTransaction(new Transaction('address2','address1',50));

console.log('\n Starting the miner');
myblockchain.minePendingTransaction('th-address');

console.log('\n Balance of thet hlaing is ', myblockchain.getBalanceOfAddress('th-address') );

console.log('\n Starting the miner');
myblockchain.minePendingTransaction('th-address');

console.log('\n Balance of thet hlaing is ', myblockchain.getBalanceOfAddress('th-address') );