var Web3 = require('web3');
var Cryptr=require('cryptr');
var fs = require('fs');
//var bn = require('homomorphicjs');
var bn = require('/Users/peter087744982/Desktop/homomorphicjs');

var sha3_256 = require("js-sha3").sha3_256;

//PaillierEncryption
var cipher1;
var cipher2;
var cipher3;
var key;
//generate key pair, will be removed when we can transfer both publicKey & certificate.
function KeyPairGenerator(){
  key=bn.generate_paillier_keypair();
}
//encrypt plaintext to ciphertext, should not be implmented on this side.
function Encryption(){
  cipher1=key['public_key'].raw_encrypt(m1,1080);//about 32bits, input 40000000000
  cipher2=key['public_key'].raw_encrypt(m2,1080);
  cipher3=key['public_key'].raw_encrypt(m3,1080);
}
//show up public key
function printPublicKey(){
  console.log("Public Key : ");
  console.log("g : "+key['public_key'].toJSON()['g']);
  console.log("n : "+key['public_key'].toJSON()['n']);
  //console.log("sk : "+key['private_key'].getPublicKey().toJSON()['g']);
}
//show up private key
function printPrivateKey(){
  console.log("Private Key : ");
  console.log("lambda : "+key['private_key'].toJSON()['lambda']);
  console.log("mu : "+key['private_key'].toJSON()['mu']);
}

var tmp='';
var c=0;
var tmp1='';
var tmp2='';
var tmp3='';
var ciphertextOP;
//show up ciphertext
function CipherOperation(){
  tmp='';
  c=0;
  tmp1='';
  for(var a=0;typeof(cipher1[a.toString()])=="number"||a.toString()=='t'||a.toString()=='s';a++){
    tmp1 = tmp1 + cipher1[a.toString()];
  }

  tmp2='';
  for(var a=0;typeof(cipher2[a.toString()])=="number"||a.toString()=='t'||a.toString()=='s';a++){
    tmp2 = tmp2 + cipher2[a.toString()];
  }

  tmp3='';
  for(var a=0;typeof(cipher3[a.toString()])=="number"||a.toString()=='t'||a.toString()=='s';a++){
    tmp3 = tmp3 + cipher3[a.toString()];
  }

  ciphertextOP=cipher1.multiply(cipher2).multiply(cipher3);
  c='';
  for(var a=0;typeof(ciphertextOP[a.toString()])=="number"||a.toString()=='t'||a.toString()=='s';a++){
    c = c + ciphertextOP[a.toString()];
  }
  //console.log("Cipher Operation : "+c);
}
function printCipher(){
  console.log("Cipher1 : "+tmp1);
  console.log("Cipher2 : "+tmp2);
  console.log("Cipher3 : "+tmp3);
  console.log("Cipher Operation : "+c);
}
//Decrypt the cipher text to plain text, we can obtain homomorphic property. e.g C1*C2*C3 = m1+m2+m3
function Decryption(){
  var ans=key['private_key'].raw_decrypt(ciphertextOP)[0];
  console.log(ans);
}



KeyPairGenerator();
//printPublicKey();
//printPrivateKey();
//Encryption();
//CipherOperation();
//printCipher();
//Decryption();
WriteToFile();
function WriteToFile() {
  //Write pk
  fs.writeFile("server2_pk.txt",key['public_key'].toJSON()['n']+'\n'/*+key['public_key'].toJSON()['g']*/,
  function(err) {
      if(err) {
          console.log(err);
      } else {
        console.log("The server2_pk file was saved!");
  }
  });
  //Write sk
  fs.writeFile("server2_sk.txt", /*'lambda : '+*/key['private_key'].toJSON()['lambda']+'\n'+/*'mu : '+*/key['private_key'].toJSON()['mu'],
  function(err) {
      if(err) {
          console.log(err);
      } else {
        console.log("The server2_sk file was saved!");
  }
  });
}
function readFile(pub){
  var fs = require("fs"),
   lineReader = require('line-reader'),
    filename = "server1_pk.txt",
    encode = "utf8";
  var input = fs.createReadStream('server1_pk.txt');
  var remaining = '';
  //read data line-by-line
  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
      var line = remaining.substring(4, index);//remove oher info
      remaining = remaining.substring(index + 5);//remove other info
      console.log('Line: ' + line);
      console.log('typeof: ' + typeof(line));
      pub = line;
      console.log('------');
      index = remaining.indexOf('\n');
    }
  });

  input.on('end', function() {
    if (remaining.length > 0) {
      console.log('Line: ' + remaining);
    }
  });
}
