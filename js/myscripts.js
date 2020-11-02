/**
 *  send post request with given parameters to a defined url in server *
 */ 
function sendRequest(parameters, url, requestType="POST") 
{
  var request = new XMLHttpRequest();
  request.open(requestType, url, true);
  request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  if(requestType=="GET")
  {
    request.send();
  }
  else
  {
    console.log("sending data: ");
    console.log(JSON.stringify(parameters));
    request.send(JSON.stringify(parameters));
  }  
  return request;
}

function sendEncryptedData(payload)
{
    sendRequest(payload, "http://localhost:5000/encrypteddata");
}