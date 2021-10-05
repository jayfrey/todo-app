const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Pass incoming request params to body
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let db = new sqlite3.Database(':memory:', (err) => {
    if (err) throw err;
    console.log('Connected to the in-memory database.');
});

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../frontend/build')));


db.serialize(() => {

    let createSql = 'CREATE TABLE projects (' +
                    '[id] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,' +
                    '[name] NVARCHAR(100),' +
                    '[status] NVARCHAR(100))';

    let insertSql = 'INSERT INTO projects (name, status) VALUES' +
                    "('Web App', 'to_do')," +
                    "('Mobile App', 'in_progress')," +
                    "('ML App', 'done')";

    let selectSql = 'SELECT * FROM projects';

    db.run(createSql);
    db.run(insertSql);
    db.each(selectSql, (err, row) => {
        if (err) throw err;
        console.log(row);
    });
});

app.post('/api/project/get-by-status', (req, res) => {

    var data = [
        req.body.status,
    ];
    
    let sql = 'SELECT * FROM projects WHERE status = ?';

    db.all(sql, data, (err, rows) => {
        if (err) throw err;
        var count = 0;
        rows.forEach( (row) => {
            count += 1;
        })
        res.send({
            'data' : rows,
            'count' : count
        });
    });
});

app.get('/api/project/all', (req, res) => {
    
    let sql = 'SELECT * FROM projects';

    db.all(sql, (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});

app.post('/api/project/add', (req, res) => {

    console.log(req.body);
    
    var data = [
        req.body.name,
        req.body.status,
    ];
    
    let sql = 'INSERT INTO projects (name, status) VALUES (?, ?)';

    db.run(sql, data, (err) => {
        if (err) throw err;
        res.send('Insert success');
    });
})

app.put('/api/project/update', (req, res) => {

    console.log(req.body);

    var data = [
        req.body.status,
        req.body.id,
    ];

    let sql = 'UPDATE projects SET status = ? WHERE id = ?';

    db.run(sql, data, (err) => {
        if (err) throw err;
        res.send('Update success');
    });
})



// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
