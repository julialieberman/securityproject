const express = require('express');
// my scripts
//connect to iothub

var app = express();
const server= require('http').createServer(app);
app.use(express.static('./'))



// render the html pages. the '/<name>' is what the url extension will look like in the browser
app.get('/', function (req, res) {
    res.render('index.html')
})


/** on page error */
app.use(function (req, res, next) 
{
    res.status(404).send("404 not found. :(");
})

server.listen(5000, () => console.log('App listening on http://localhost:5000')); //listen to port 5000