var Web3 = require('web3');
var Cryptr=require('cryptr');
var fs = require('fs');
//var bn = require('homomorphicjs');
var bn = require('/Users/peter087744982/Desktop/homomorphicjs');

var sha3_256 = require("js-sha3").sha3_256;

var secret;
secret = process.argv[2];
console.log(secret);
//Randomly split data into three numbers.
var m1;
var m2;
var m3;

function splitInfo(s){
  m1 = s - Math.floor((Math.random() * 10) + 1);
  s = s - m1;
  m2 = s - Math.floor((Math.random() * 10) + 1);
  s = s - m2;
  m3 = s;
}

splitInfo(secret);
console.log("m1 : "+m1);
console.log("m2 : "+m2);
console.log("m3 : "+m3);

//PaillierEncryption
var cipher1;
var cipher2;
var cipher3;
var key;

//generate key pair, will be removed when we can transfer both publicKey & certificate.
function KeyPairGenerator(length,pub,lam,mu){
  if(typeof length=='undefined'){
    key=bn.generate_paillier_keypair();
  }
  else if(typeof length=='number'&&typeof pub=='string'&&typeof lam=='string'){
    key=bn.generate_paillier_keypair(length,pub,lam,mu);
  }
  else{
    key=bn.generate_paillier_keypair(length,pub);
  }
  /*
  else{
    // (length,n,miu,lamda) for verfication
    key=bn.generate_paillier_keypair(1024,'110548526384393510720671032490406829567690045142389820268343770556892732268571630984612377978164380803763981217379484986349185648466264866075283105536512354480649141036034771883979754626168854682020810561237149462330894866226001834553756911158173549227072099959129140112696067075550461986486461532185998540129','2910350249977286689560644073014060523591276981811188036027914826827994299258273797487117795031172344923038606215604032135356578673131411356241122138761613178361630119507286654604785857472231323263626091616104774837304411401550414167434164492237420402656485804688617819983185337867575321066008051980210785901','110548526384393510720671032490406829567690045142389820268343770556892732268571630984612377978164380803763981217379484986349185648466264866075283105536512333412559546473749739635330718907118997552240688969622774780302839332311472733061609296404062737355936258841543351149695208266100756051815301471056277702676');
  }*/
}
//encrypt plaintext to ciphertext, should not be implmented on this side.

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
//Decrypt the cipher text to plain text, we can obtain homomorphic property. e.g C1*C2*C3 = m1+m2+m3
function Decryption(){
  var ans=key['private_key'].raw_decrypt(ciphertextOP)[0];
  console.log("ans : "+ans);
  console.log("type ciphertextOP : "+typeof(ciphertextOP));
}


//if length is empty, then we generate default key pair Automatically.
//KeyPairGenerator(1024);
//printPublicKey();
//printPrivateKey();
//Decryption();
//testCase();
console.log("Program begin");
//Encrypt_server1();
readServer1_encrypt();
readServer2_encrypt();
readServer3_encrypt();

//test case
function testCase(){
  var g =110548526384393510720671032490406829567690045142389820268343770556892732268571630984612377978164380803763981217379484986349185648466264866075283105536512354480649141036034771883979754626168854682020810561237149462330894866226001834553756911158173549227072099959129140112696067075550461986486461532185998540130;
  var n =110548526384393510720671032490406829567690045142389820268343770556892732268571630984612377978164380803763981217379484986349185648466264866075283105536512354480649141036034771883979754626168854682020810561237149462330894866226001834553756911158173549227072099959129140112696067075550461986486461532185998540129;
  var lamda=110548526384393510720671032490406829567690045142389820268343770556892732268571630984612377978164380803763981217379484986349185648466264866075283105536512333412559546473749739635330718907118997552240688969622774780302839332311472733061609296404062737355936258841543351149695208266100756051815301471056277702676;
  var miu=2910350249977286689560644073014060523591276981811188036027914826827994299258273797487117795031172344923038606215604032135356578673131411356241122138761613178361630119507286654604785857472231323263626091616104774837304411401550414167434164492237420402656485804688617819983185337867575321066008051980210785901;
  //key['public_key'].toJSON()['g'] = g.toString();
  //key['public_key'].toJSON()['n'] = n.toString();
  KeyPairGenerator();
  var cipp = key['public_key'].raw_encrypt(501,1080);
  console.log("g_mod : "+key['public_key'].toJSON()['g']);
  var message = key['private_key'].raw_decrypt(cipp);

  //console.log("g : "+g);
  console.log("cipp : "+cipp);
  console.log("message : "+message);
}
//Read Server1's public key and encrypt with public key,then write back to file.
function readServer1_encrypt(){
  var fs = require("fs"),
    //lineReader = require('line-reader'),
    filename = "server1_pk.txt",
    encode = "utf8";
  var input = fs.createReadStream('server1_pk.txt');
  var remaining = '';
  //read data line-by-line
  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
      var line = remaining.substring(0, index);//remove oher info
      remaining = remaining.substring(index + 1);//remove other info
      //console.log("Line");
      //console.log(line);

      pk = line.substring();
      //Create Server1's public key.
      KeyPairGenerator(1024,pk);
      //Encryt data with Server1's public key.
      cipher1=key['public_key'].raw_encrypt(m1,1080);//about 32bits, input 40000000000
      console.log("cipher1 : "+cipher1);
      //Write the cipher1 to file.
      fs.writeFile("cipher1.txt", /*'cipher1 : '+*/cipher1+'\nhash function : sha3-256', function(err) {
          if(err) {
              console.log(err);
          } else {
            console.log("The cipher1 file was saved!");
      }
      });
      index = remaining.indexOf('\n');
    }
  });
  input.on('end', function() {
    if (remaining.length > 0) {
      console.log('Line: ' + remaining);
    }
  });
}
//Read Server2's public key and encrypt with public key,then write back to file.
function readServer2_encrypt(){
  var fs = require("fs"),
    //lineReader = require('line-reader'),
    filename = "server2_pk.txt",
    encode = "utf8";
  var input = fs.createReadStream('server2_pk.txt');
  var remaining = '';
  //read data line-by-line
  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
      var line = remaining.substring(0, index);//remove oher info
      remaining = remaining.substring(index + 1);//remove other info
      //console.log("Line");
      //console.log(line);

      pk = line.substring();
      //Create Server2's public key.
      KeyPairGenerator(1024,pk);
      //Encryt data with Server2's public key.
      cipher2=key['public_key'].raw_encrypt(m2,1080);//about 32bits, input 40000000000
      console.log("cipher2 : "+cipher2);
      //Write the cipher2 to file.
      fs.writeFile("cipher2.txt", /*'cipher2 : '+*/cipher2+'\nhash function : sha3-256', function(err) {
          if(err) {
              console.log(err);
          } else {
            console.log("The cipher2 file was saved!");
      }
      });
      index = remaining.indexOf('\n');
    }
  });
  input.on('end', function() {
    if (remaining.length > 0) {
      console.log('Line: ' + remaining);
    }
  });
}
//Read Server3's public key and encrypt with public key,then write back to file.
function readServer3_encrypt(){
  var fs = require("fs"),
    //lineReader = require('line-reader'),
    filename = "server3_pk.txt",
    encode = "utf8";
  var input = fs.createReadStream('server3_pk.txt');
  var remaining = '';
  //read data line-by-line
  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
      var line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      //console.log("Line");
      //console.log(line);

      pk = line.substring();
      //Create Server3's public key.
      KeyPairGenerator(1024,pk);
      //Encryt data with Server3's public key.
      cipher3=key['public_key'].raw_encrypt(m3,1080);//about 32bits, input 40000000000
      console.log("cipher3 : "+cipher3);
      //Write the cipher3 to file.
      fs.writeFile("cipher3.txt", /*'cipher3 : '+*/cipher3+'\nhash function : sha3-256', function(err) {
          if(err) {
              console.log(err);
          } else {
            console.log("The cipher3 file was saved!");
      }
      });
      index = remaining.indexOf('\n');
    }
  });
  input.on('end', function() {
    if (remaining.length > 0) {
      console.log('Line: ' + remaining);
    }
  });
}
