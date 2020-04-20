//Creating a blockchain with Javascript: Learn how to write your own Blockchain with JavaScript.
//Implementing Proof-of-Work in Javascript: Proof-of-work will secure our blockchain against spammers and people trying to tamper with our blocks.
//Miner rewards & transactions: Mining rewards steadily introduce new coins into the system.
//Signing transactions: Transactions on a blockchain have to be signed with a private key. This makes sure that people can only spend coins if they have the private key of their wallet.
    //anyone can make any transaction
    //manadatory to sign a transaction with a private and public key 

const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');//alogrithm basis of bitcoin wallet

class Transaction {
    constructor(fromAddress, toAddress, amount) {//comes from someone, goes to someone and an amount
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey){//private and public key pair -- (keygenerator.js.Line 4: ... = ec.gneKeyPair();)
        //check if public key is equals the from address
        //only spend coins from the wallet you have the private key for
        //private key = public key
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You cannot sign for transaction for other wallets!')
        }
        
        const hashTX = this.calculateHash();
        const sig = signingKey.sign(hashTX, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValidTransaction(){//correctly mined
        //take into account mining reward transactions -- not signed but valid
        if(this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transaction');
        }

        const publicKey= ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Block {
    constructor(timestamp, transactions, previousHash) {//removed index (uses the order of the array no need for index)
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) { //difficulty is a property
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("BLOCK MINED: " + this.hash); //won't change if the contents are not changed. while is an endless loop.
    }

    hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isValidTransaction()){
                return false;
            }
        }

        return true;
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block("01/01/2020", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);//in reality miners pick the transactions they want to include. 1MB limit on each block.
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined!");
        this.chain.push(block); //needs checks

        this.pendingTransactions = [];
    }

    addTransaction(transaction) {
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transactions must include from and to address')
        }

        if(!transaction.isValidTransaction()){
            throw new Error('Cannot add an invalid transaction to chain');
        }

        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    // addBlock(newBlock) {
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     //newBlock.hash = newBlock.calculateHash();
    //     newBlock.mineBlock(this.difficulty);

    //     this.chain.push(newBlock); //needs checks
    // }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {//not starting with 0 , 0 is GenesisBlock
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(!currentBlock.hasValidTransactions){
                console.log('!currentBlock.hasValidTransactions')
                return false;
            }

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log('currentBlock.hash !== currentBlock.calculateHash()')
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.calculateHash()) {
                console.log('currentBlock.previousHash !== previousBlock.calculateHash()')
                return false;
            }
        }
        
        return true;
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;