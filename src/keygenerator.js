const EC = require('elliptic').ec;
const ec = new EC('secp256k1');//alogrithm basis of bitcoin wallet

const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');//from and to addresses
const privateKey = key.getPrivate('hex');

console.log();
console.log('Private Key: ', privateKey);
console.log('Public Key: ', publicKey);
