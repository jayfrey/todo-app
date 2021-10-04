const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');

console.log('dirname: '+__dirname);

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../frontend/build')));

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from server!'});
});

//app.post('/', function (req, res) {
//    res.send('Got a POST request')
//})
//
//app.put('/user', function (req, res) {
//    res.send('Got a PUT request at /user')
//})
//
//app.delete('/user', function (req, res) {
//    res.send('Got a DELETE request at /user')
//})


// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
