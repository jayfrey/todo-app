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
                    '[status] NVARCHAR(100),' +
                    '[position] INTEGER)';

    let insertSql = "INSERT INTO projects (name, status, position) VALUES" +
                    "('Web App', 'to_do', 0)," +
                    // "('Web App', 'to_do', 3)," +
                    // "('Web App', 'to_do', 29)," +
                    // "('Mobile App', 'in_progress', 0)," +
                    "('ML App', 'done', 0)";

    let selectSql = 'SELECT * FROM projects';

    db.run(createSql, (err, row) => {
        if (err) throw err;
        console.log(row);
    });
    db.run(insertSql, (err, row) => {
        if (err) throw err;
        console.log(row);
    });
    db.each(selectSql, (err, row) => {
        if (err) throw err;
        console.log(row);
    });
});

app.post('/api/project/get-by-status', (req, res) => {

    var data = [
        req.body.status,
    ];
    
    let sql = 'SELECT * FROM projects WHERE status = ? ORDER BY position ASC';

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
    let queryLastOrderSql = "SELECT MAX(position) as position FROM projects WHERE status = 'to_do'";
    
    db.get(queryLastOrderSql, (err, row) => {
        if (err) throw err;

        var data = [
            req.body.name,
            req.body.status,
            row.position+1,
        ];
        
        let sql = "INSERT INTO projects (name, status, position) VALUES (?, ?, ?)";

        db.run(sql, data, (err) => {
            if (err) throw err;
            res.send('Insert success');
        });
    });
})

app.put('/api/project/update', (req, res) => {

    console.log(req.body);

    var data = [
        req.body.status,
        req.body.position,
        req.body.id,
    ];

    let sql = 'UPDATE projects SET status = ?, position = ? WHERE id = ?';

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
