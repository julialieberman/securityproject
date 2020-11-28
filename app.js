const express = require('express');
// my scripts
const decryption = require('./decryption.js');
var app = express();
app.use(express.json());

const server= require('http').createServer(app);
app.use(express.static('./'))

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


const encryptedSharedKey="7J9dmsS}xGsf6@-oMDzGwar8r7lv9ZPCo/DYTH0F";
//const apiSharedSecret="n8+6AvGu/i2qo86FQvZ4TLgsS56jqOSGzgOa@Eul";

// render the html pages. the '/<name>' is what the url extension will look like in the browser
app.get('/', function (req, res) {
    res.render('index.html')
})

app.post('/encrypteddata', function(req, res){
    console.log("trying to decrypt data!");
    console.log(req.body);
    let encKey=req.body.encKey;
    let encPayment=req.body.encPaymentData;
    console.log(encKey);
    console.log(encPayment);
    decryption.decryptPayload(encryptedSharedKey, encKey, encPayment);


    res.send("Successfully sent encrypted data to server");
})

/** on page error */
app.use(function (req, res, next) 
{
    res.status(404).send("404 not found. :(");
})

server.listen(5000, () => console.log('App listening on http://localhost:5000')); //listen to port 5000