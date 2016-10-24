var Web3 = require('web3');
var Cryptr=require('cryptr');
var fs = require('fs');
//var bn = require('homomorphicjs');
var bn = require('/Users/peter087744982/Desktop/homomorphicjs');
var jsbn = require('/Users/peter087744982/node_modules/jsbn');

var sha3_256 = require("js-sha3").sha3_256;

//PaillierEncryption
var key;
//generate key pair, will be removed when we can transfer both publicKey & certificate.
function KeyPairGenerator(length){
  if(typeof length=='undefined'){
    key=bn.generate_paillier_keypair();
  }
  else{
    // (length,n,miu,lamda) for verfication
    key=bn.generate_paillier_keypair(1024,'110548526384393510720671032490406829567690045142389820268343770556892732268571630984612377978164380803763981217379484986349185648466264866075283105536512354480649141036034771883979754626168854682020810561237149462330894866226001834553756911158173549227072099959129140112696067075550461986486461532185998540129','2910350249977286689560644073014060523591276981811188036027914826827994299258273797487117795031172344923038606215604032135356578673131411356241122138761613178361630119507286654604785857472231323263626091616104774837304411401550414167434164492237420402656485804688617819983185337867575321066008051980210785901','110548526384393510720671032490406829567690045142389820268343770556892732268571630984612377978164380803763981217379484986349185648466264866075283105536512333412559546473749739635330718907118997552240688969622774780302839332311472733061609296404062737355936258841543351149695208266100756051815301471056277702676');
  }
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




//Decrypt the cipher text to plain text, we can obtain homomorphic property. e.g C1*C2*C3 = m1+m2+m3
function Decryption(){
  KeyPairGenerator(1024);
  var tt='2531529960021248298936326408016121626231189368459476431587381274660079672460157381351067229156260937819719365232724046712847026357624653628144423648589757430423995934866306556825947697697068985436707931425990083902219976779143048181414296863144787606415892390922625910917267657059687032591303762372426316978578814366844917877624048260917096615176162320743972116608777462908219416287845505544233215443851852985965396794649957784925714337834178329421633764316957938127227326691583915118045874112769848863534270166821489279112640445525172561127587101631946743238845579265446432790383948823051060509400191922575044197297';
  var tbn = new jsbn(tt.toString(),10);
  //var ans=key['private_key'].raw_decrypt(ciphertextOP)[0];
  var ans=key['private_key'].raw_decrypt(tbn)[0];
  console.log(ans);
}



KeyPairGenerator();
//WriteToFile();
//printPublicKey();
//printPrivateKey();
//Encryption();
//CipherOperation();
//printCipher();
//Decryption();
WriteToFile();
//readFile();
function WriteToFile() {
  //write pk
  fs.writeFile("staff_pk.txt",key['public_key'].toJSON()['n']+'\n'/*+key['public_key'].toJSON()['g']*/,
  function(err) {
      if(err) {
          console.log(err);
      } else {
        console.log("The staff_pk file was saved!");
  }
  });
  //Write sk
  fs.writeFile("staff_sk.txt", /*'lambda : '+*/key['private_key'].toJSON()['lambda']+'\n'+/*'mu : '+*/key['private_key'].toJSON()['mu'],
  function(err) {
      if(err) {
          console.log(err);
      } else {
        console.log("The staff_sk file was saved!");
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
