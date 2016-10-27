function doCall(s, callback) {
  s = s+'Alice';
  return callback(s);

}

var s = "Peter";
doCall(s, function(response){
    // Here you have access to your variable
    s = response;
    console.log(response);
})
console.log(s);
