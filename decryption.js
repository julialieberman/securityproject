const crypto = require('crypto');
// key = encryption shared secret
// wrappedKey = req.body.encKey
// payload = req.body.encPayloadData or something, from V.on(payment.success)
module.exports = {
    decryptPayload: function(key,wrappedKey,payload){
        let decryptedKey = decrypt(wrappedKey,key);
        let decryptedMsg = decrypt(payload,decryptedKey);
        return decryptedMsg.toString('utf8');
} }

// this should decrypt the data returned from the Visa Checkout API
function decrypt(encrypted,key){
    let encryptedBuffer = new Buffer.from(encrypted,'base64'); //base-64 decode encrypted 'dynamic' key
    let hmac = new Buffer.alloc(32);
    let iv = new Buffer.alloc(16);
    encryptedBuffer.copy(hmac,0,0,32); //grab first 32 bytes, this is the HMAC
    encryptedBuffer.copy(iv,0,32,48);  //this is used as the initialization vector for the decryption algorithm
    let data = Buffer.from(encryptedBuffer).slice(48); //data = first 48 bytes

    // now we will decrypt remaining data using AES-256-CBC, the IV from above and the hash of the shared secret
    var hash = crypto.createHmac('SHA256', key).update
    (Buffer.concat([iv,data])).digest();
    if(!hmac.equals(hash))
    {
        // Handle HMAC validation failure
        console.error("HMAC does not equal hash, decryption.js line 24");
        return ''; 
    }
    let decipher = crypto.createDecipheriv('aes-256-cbc',
    crypto.createHash('sha256').update(key).digest(), iv);
    let decryptedData = Buffer.concat([decipher.update(data), decipher.final()]);
    console.log("decrypted data");
    console.log(decryptedData);
    return decryptedData;
}
