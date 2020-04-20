const {Blockchain,Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');//alogrithm basis of bitcoin wallet

const myKey = ec.keyFromPrivate('2228deb7ee791826dd155d26b59444c6ad6af6e89e8f4480bff47b901d332c0f');
const myWalletAddress = myKey.getPublic('hex');

let terenceCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
terenceCoin.addTransaction(tx1);


//terenceCoin.addTransaction(new Transaction('address1', 'address2', 100));

console.log('\n Starting the miner...');
terenceCoin.minePendingTransactions(myWalletAddress);

console.log('\nBalance of terence is', terenceCoin.getBalanceOfAddress(myWalletAddress));

//terenceCoin.chain[1].transactions[0] = 1;

console.log('Is blockchain valid? ' + terenceCoin.isChainValid());

console.log('\n Starting the miner AGAIN with rewards...');
terenceCoin.minePendingTransactions(myWalletAddress);

console.log('\nBalance of terence is', terenceCoin.getBalanceOfAddress(myWalletAddress));
console.log('Is blockchain valid? ' + terenceCoin.isChainValid());

// console.log("Mining block 1...")
// terenceCoin.addBlock(new Block(1, "01/07/2020", { amount: 1 }));
// console.log("Mining block 2...")
// terenceCoin.addBlock(new Block(2, "01/22/2020", { amount: 10 }));
// console.log("Mining block 3...")
// terenceCoin.addBlock(new Block(3, "01/30/2020", { amount: 256 }));
// console.log("Mining block 4...")
// terenceCoin.addBlock(new Block(4, "01/30/2020", { amount: 3000 }));
// console.log('Is blockchain valid? ' + terenceCoin.isChainValid())

// terenceCoin.chain[1].data = { amount: 120 }
// terenceCoin.chain[1].hash = terenceCoin.chain[1].calculateHash();
// console.log('Is blockchain valid? ' + terenceCoin.isChainValid());

//console.log(JSON.stringify(terenceCoin, null, 4));