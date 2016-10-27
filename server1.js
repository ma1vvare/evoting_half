var Web3 = require('web3');
var Cryptr=require('cryptr');
var fs = require('fs');
//var bn = require('homomorphicjs');
var bn = require('/Users/peter087744982/Desktop/homomorphicjs');
var jsbn = require('/Users/peter087744982/node_modules/jsbn');

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
    var fs = require("fs"),
      lineReader = require('line-reader'),
      filename = "server1_plain.txt",
      encode = "utf8";
    var input = fs.createReadStream('server1_plain.txt');
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
        setTimeout(callback(plain), 1000);
      }
    });

  }
  //main function!
  var staff_pk='';
  var plain='';
  var paillier_cipher1='';
  //read staff's pk
  readStaff(staff_pk,function(response){
    staff_pk = response;
    //encrypt data1 to staff!
    encryptstaff(plain,function(response){
      plain = response;
      //console.log('staff_pk :'+staff_pk);
      //console.log('plain :'+plain);
      KeyPairGenerator(1024,staff_pk);
      //console.log("staff_pk_g : "+key['public_key'].toJSON()['g']);
      //console.log("staff_pk_n : "+key['public_key'].toJSON()['n']);
      paillier_cipher1=key['public_key'].raw_encrypt(Number(plain),1080);//about 32bits, input 40000000000
      //console.log('paillier_cipher1 :'+paillier_cipher1);
      fs.writeFile("paillier_cipher1.txt", /*'cipher3 : '+*/paillier_cipher1+'\nhash function : sha3-256', function(err) {
          if(err) {
              console.log(err);
          } else {
            console.log("The paillier_cipher1 file was saved!");
      }
      });
    })
  })
  //console.log('staff_pk :'+staff_pk);
}
// generate server1's key pair.
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




  KeyPairGenerator();
  WriteToFile();

  function WriteToFile() {
    //write pk
    fs.writeFile("server1_pk.txt",key['public_key'].toJSON()['n']+'\n'/*+key['public_key'].toJSON()['g']*/,
    function(err) {
        if(err) {
            console.log(err);
        } else {
          console.log("The server1_pk file was saved!");
    }
    });
    //Write sk
    fs.writeFile("server1_sk.txt", /*'lambda : '+*/key['private_key'].toJSON()['lambda']+'\n'+/*'mu : '+*/key['private_key'].toJSON()['mu'],
    function(err) {
        if(err) {
            console.log(err);
        } else {
          console.log("The server1_sk file was saved!");
    }
    });
  }
}
