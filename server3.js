var Web3 = require('web3');
var Cryptr=require('cryptr');
var fs = require('fs');
var bigInt = require("big-integer");
//var bn = require('homomorphicjs');
var bn = require('/Users/peter087744982/Desktop/homomorphicjs');

var sha3_256 = require("js-sha3").sha3_256;
var secret = process.argv[2];


if(secret=='read'){

  //Decrypt split info from user.
  var lam='';
  var miu='';
  //read Staff's public key & Encryption.

  function readStaff(staff_pk,callback){
    var fs = require("fs"),
      lineReader = require('line-reader'),
      filename = "staff_pk.txt",
      encode = "utf8";
    var input = fs.createReadStream('staff_pk.txt');
    var remaining = '';

    //read data line-by-line

    input.on('data', function(data) {
      remaining += data;

      var index = remaining.indexOf('\n');
      while (index > -1) {
        var line = remaining.substring(0, index);//remove oher info
        remaining = remaining.substring(index + 1);//remove other info

        staff_pk = line;
        index = remaining.indexOf('\n');
        setTimeout(callback(staff_pk), 1000);
      }
    });

    input.on('end', function() {
      if (remaining.length > 0) {
        //console.log('Line: ' + remaining);
      }
    });
  }
  function encryptstaff(plain,callback){
    //console.log('encrypt');
    //console.log('staff_pk2 :'+staff_pk);
    var fs = require("fs"),
      lineReader = require('line-reader'),
      filename = "server3_plain.txt",
      encode = "utf8";
    var input = fs.createReadStream('server3_plain.txt');
    var remaining = '';

    //read data line-by-line

    input.on('data', function(data) {
      remaining += data;

      var index = remaining.indexOf('\n');
      while (index > -1) {
        var line = remaining.substring(0, index);//remove oher info
        remaining = remaining.substring(index + 1);//remove other info
        //console.log('Line: ' + line);
        //console.log('typeof: ' + typeof(line));
        plain = line;
        index = remaining.indexOf('\n');
        setTimeout(callback(plain), 2000);
      }
    });
  }
  function readPailler_cipher2(paillier_cipher2,callback){
    var fs = require("fs"),
      lineReader = require('line-reader'),
      filename = "paillier_cipher2.txt",
      encode = "utf8";
    var input = fs.createReadStream('paillier_cipher2.txt');
    var remaining = '';
    //read data line-by-line
    input.on('data', function(data) {
      remaining += data;

      var index = remaining.indexOf('\n');
      while (index > -1) {
        var line = remaining.substring(0, index);//remove oher info
        remaining = remaining.substring(index + 1);//remove other info
        //console.log('Line: ' + line);
        //console.log('typeof: ' + typeof(line));
        paillier_cipher2 = line;
        index = remaining.indexOf('\n');
        setTimeout(callback(paillier_cipher2), 2000);
      }
    });
  }
  //main function!
  var staff_pk='';
  var plain='';
  var paillier_cipher3='';
  var paillier_cipher2='';
  //read staff's pk
  readStaff(staff_pk,function(response){
    staff_pk = response;
    //encrypt data1 to staff!
    encryptstaff(plain,function(response){
      plain = response;
      readPailler_cipher2(paillier_cipher2,function(response){
        paillier_cipher2=response;
        //console.log('staff_pk :'+staff_pk);
        //console.log('plain :'+plain);
        //console.log('paillier_cipher2 :'+paillier_cipher2);
        //console.log('typeof1 :'+typeof paillier_cipher2);
        KeyPairGenerator(1024,staff_pk);
        paillier_cipher3=key['public_key'].raw_encrypt(Number(plain),1080);//about 32bits, input 40000000000
        //console.log('paillier_cipher3 :'+paillier_cipher3);
        //console.log('typeof2 :'+typeof paillier_cipher3.toString());
        //cipher multiplication
        var cipher_mul=key['public_key'].createBNOp(paillier_cipher2,paillier_cipher3.toString());
        //console.log('cipher_mul :'+cipher_mul);

        fs.writeFile("paillier_cipher3.txt", /*'cipher3 : '+*/cipher_mul+'\nhash function : sha3-256', function(err) {
            if(err) {
                console.log(err);
            } else {
              console.log("The paillier_cipher3 file was saved!");
        }
        });
        fs.writeFile("paillier_cipher2.txt", /*'cipher3 : '+*/cipher_mul+'\nhash function : sha3-256', function(err) {
            if(err) {
                console.log(err);
            } else {
              console.log("The paillier_cipher2 file was saved!");
        }
        });
        fs.writeFile("paillier_cipher1.txt", /*'cipher3 : '+*/cipher_mul+'\nhash function : sha3-256', function(err) {
            if(err) {
                console.log(err);
            } else {
              console.log("The paillier_cipher1 file was saved!");
        }
        });
      })
      //console.log("staff_pk_g : "+key['public_key'].toJSON()['g']);
      //console.log("staff_pk_n : "+key['public_key'].toJSON()['n']);
    })
  })

  //console.log('staff_pk :'+staff_pk);
}

else{
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
    else if(typeof length=="number"&&typeof pub=="string"&&typeof lam=="string"){
      //console.log('offff');
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
    fs.writeFile("server3_pk.txt",key['public_key'].toJSON()['n']+'\n'/*+key['public_key'].toJSON()['g']*/,
    function(err) {
        if(err) {
            console.log(err);
        } else {
          console.log("The server3_pk file was saved!");
    }
    });
    //Write sk
    fs.writeFile("server3_sk.txt", /*'lambda : '+*/key['private_key'].toJSON()['lambda']+'\n'+/*'mu : '+*/key['private_key'].toJSON()['mu'],
    function(err) {
        if(err) {
            console.log(err);
        } else {
          console.log("The server3_sk file was saved!");
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
        //console.log('Line: ' + line);
        //console.log('typeof: ' + typeof(line));
        pub = line;
        //console.log('------');
        index = remaining.indexOf('\n');
      }
    });

    input.on('end', function() {
      if (remaining.length > 0) {
        //console.log('Line: ' + remaining);
      }
    });
  }

}
