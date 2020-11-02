
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


function decrypt(encrypted,key){
    let encryptedBuffer = new Buffer(encrypted,'base64'); //base-64 decode encrypted 'dynamic' key
    // TODO: Check that data(encryptedBuffer) is at least bigger
    // than HMAC + IV length , i.e. 48 bytes
    let hmac = new Buffer(32);
    let iv = new Buffer(16);
    encryptedBuffer.copy(hmac,0,0,32); //grab first 32 bytes, this is the HMAC
    encryptedBuffer.copy(iv,0,32,48);  //this is used as the initialization vector for the decryption algorithm
    let data = Buffer.from(encryptedBuffer).slice(48); //data = first 48 bytes

    // now we will decrypt remaining data using AES-256-CBC, the IV from above and the hash of the shared secret
    var hash = crypto.createHmac('SHA256', key).update
    (Buffer.concat([iv,data])).digest();
    if(!hmac.equals(hash))
    {
        // TODO: Handle HMAC validation failure
        console.error("HMAC does not equal hash, decryption.js line 24");
        return ''; 
    }
    let decipher = crypto.createDecipheriv('aes-256-cbc',
    crypto.createHash('sha256').update(key).digest(), iv);
    let decryptedData = Buffer.concat([decipher.update(data), decipher.final()]);
    console.log("decrypted data i think it worked WOOHOOOOOOO");
    console.log(decryptedData);
    return decryptedData;
}
