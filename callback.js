function doCall(s, callback) {
    urllib.request(urlToCall, { wd: 'nodejs' }, function (err, data, response) {
        var statusCode = response.statusCode;
        finalData = getResponseJson(statusCode, data.toString());
        return callback(finalData);
    });
}
var s = "Peter";
doCall(s, function(response){
    // Here you have access to your variable
    console.log(response);
})
