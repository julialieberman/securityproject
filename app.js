const express = require('express');
global.crypto = require('crypto');

// my scripts
const decryption = require('./decryption.js');
var app = express();
app.use(express.json());
var https = require('https');
var request = require('request');
const server= require('http').createServer(app);
app.use(express.static('./'))

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const apiKey='XBEAIH512D4IEHUNR3U921VmvlTWenZGBUYa5rpqRpQkF57nY';
const sharedSecret='7J9dmsS}xGsf6@-oMDzGwar8r7lv9ZPCo/DYTH0F'; //encryption shared secret
const encryptionAPIKey='S0T43UBS7EVRJ2JW1ZYT13TJWadUp8f43_43Kgr0tgNsjb7rI';
const apiSharedSecret="n8+6AvGu/i2qo86FQvZ4TLgsS56jqOSGzgOa@Eul";
var queryParams = 'apikey='+apiKey;
var fullUnhashedString=queryParams+'&encryptionKey='+encryptionAPIKey;
var postBody= '';

app.get('/', function (req, res) {
    res.render('index.html')
})

function decrypt(req, res, sharedSecret, encKey, encPayment)
{
    decryption.decryptPayload(sharedSecret, encKey, encPayment);
    res.send("Successfully sent encrypted data to server");
}

function getAPIPaymentData(req, res)
{
    var timestamp = Math.floor(Date.now()/1000);
    var resourcePath="payment/data/"+req.body.callid;
    var preHashString = timestamp + resourcePath + fullUnhashedString+postBody;
    // console.log("prehash string is: ");
    // console.log(preHashString);
    var hashString = crypto.createHmac('sha256', sharedSecret).update(preHashString).digest('hex');

	var xPayToken = 'xv2:'+timestamp + ':' + hashString;
    // console.log(hashString);
	// console.log(xPayToken);
    let callId=req.body.callid;
    var options = {
        uri: 'https://sandbox.secure.checkout.visa.com/wallet-services-web/payment/data/'+callId+hashString,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-pay-token': xPayToken
        },
        json: true
    };

        console.log(options);

        options.agent = new https.Agent(options);

        request.get(options, (err, res, body) => {
            if (err) {
                return console.log(err);
            }
            console.log(`Status: ${res.statusCode}`);
            console.log(body);
        });
        res.send('Called API');
}
app.post('/encrypteddata', function(req, res){
    console.log(req.body);
    //encrypted key to be used to decrypt encPaymentData. Used shared secret to decrypt this key
    var encKey=req.body.encKey;
    //encrypted consumer and payment data. decrypt by unwrapping encKey, then using that value to decrypt this
    var encPayment=req.body.encPaymentData;

    //decrypt(req, res, sharedSecret, encKey, encPayment); //use this to decrypt data
    getAPIPaymentData(req, res); //use this to access the get payment data API
})

/** on page error */
app.use(function (req, res, next) 
{
    res.status(404).send("404 not found. :(");
})

server.listen(5000, () => console.log('App listening on https://localhost:5000')); //listen to port 5000