const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

var Token;
//Connect MySQL

var mysql_conn = mysql.createConnection({
    host: "localhost",
    user: "root@localhost",
    password: "",
    database: "AnimeApp"
});


mysql_conn.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL Successfully!");


});

//Method USE
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT');
    res.setHeader("Access-Control-Allow-Headers", "content-type, x-access-token");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});
app.use(bodyParser.json());

//Method GET

app.get('/', (req, res) => {

    res.end("HELLO SERVER");

});

app.get('/api/AnimeApp/Users', (req, res) => {

    mysql_conn.query('SELECT * FROM users', function (err, rows, fields) {
        if (err) {
            throw err;
        }

        for (id in rows) {
            console.log(rows[id].Username);
        }
    });
});

app.get('/api/AnimeApp/GetReviews', (req, res) => {

    mysql_conn.query('SELECT * FROM reviews', function (err, rows, fields) {
        if (err) {
            throw err;
        }
        else {

            res.json(rows);
        }




    });

});

app.get('/api/AnimeApp/GetFavorites', (req, res) => {

    mysql_conn.query('SELECT * FROM favorites', function (err, rows, fields) {
        if (err) {
            throw err;
        }
        else {

            res.json(rows);
        }




    });
});

//Method POST

app.post('/api/AnimeApp/login', (req, res) => {
    var Username = req.body.Username;
    var Password = req.body.Password;

    mysql_conn.query('SELECT * FROM users WHERE Username=?', Username, function (err, rows, fields) {
        if (err) {
            throw err;
        }
        else {
            if (rows.length != 0) {

                mysql_conn.query('SELECT * FROM users WHERE Username=? AND Password=?', [Username, Password], function (err, rows, fields) {
                    if (err) {
                        throw err;
                    }
                    else {
                        if (rows.length != 0) {

                            let privateKey = "this is a private key";
                            jwt.sign({ user: Username }, privateKey, function (err, jwttoken) {
                                if (err) throw err;
                                else {
                                    Token = jwttoken;
                                    console.log(Token);
                                    res.json({ "Found": "found", "Token": Token, "Username": Username });
                                }
                            });

                        }
                        else {
                            res.json({ "Found": "wrongpass" });
                        }
                    }
                });

            }
            else {

                res.json({ "Found": "Nouser" });
            }
        }

    });

});

app.post('/api/AnimeApp/signup', (req, res) => {
    var Username = req.body.Username;
    var Password = req.body.Password;
    var Email = req.body.Email;

    mysql_conn.query('SELECT * FROM users  WHERE Username=?', Username, function (err, rows, fields) {
        if (err) {
            throw err;
        }
        else if (rows.length != 0) {

            return res.send({ Use: "Used" });
        }
        else {
            mysql_conn.query("INSERT INTO users SET ? ", req.body, function (error, results, fields) {
                if (error) throw error;
                return res.send({ Use: "Notyet" });
            });
        }
    });


});
//DeleteReviews

app.post('/api/AnimeApp/deleteReviews', (req, res) => {

    let Animetitle = req.body.Animetitle;
    let Username = req.body.Username;
    let Description = req.body.Description;

    var sql = "DELETE FROM reviews WHERE Username=? AND Animetitle = ? AND Description = ?";
    mysql_conn.query(sql, [Username, Animetitle, Description], function (err, result) {
        if (err) {
            console.log("error")
        }
        else {
            res.json({ delete: "success" });
            console.log("success")
        }

    });


});
//DeleteFavorites

app.post('/api/AnimeApp/deleteFavorite', (req, res) => {

    let anime_title = req.body.anime_title;
    let Username = req.body.Username;

    var sql = "DELETE FROM favorites WHERE Username=? AND anime_title = ?";
    mysql_conn.query(sql, [Username, anime_title], function (err, result) {
        if (err) throw err;
        res.json({ delete: "success" });

    });


});
//POST addReviews

app.post('/api/AnimeApp/addReviews', (req, res) => {
    var Username = req.body.Username;
    var Description = req.body.Description;
    var Rating = req.body.Rating;
    var Animetitle = req.body.Animetitle;


    mysql_conn.query("INSERT INTO reviews SET ? ", req.body, function (error, results, fields) {
        if (error) throw error;
        else {
            console.log("insert to review success");
            res.json(results);
        }
    });
});
//POST AddFavorite

app.post('/api/AnimeApp/addFavorite', (req, res) => {
    var Username = req.body.Username;
    var anime_title = req.body.anime_title;


    mysql_conn.query('SELECT * FROM favorites  WHERE Username=? AND anime_title=?', [Username, anime_title], function (err, rows, fields) {
        if (err) {
            throw err;
        }
        else if (rows.length != 0) {

            return res.send({ "Add": "Added" });
        }
        else {
            mysql_conn.query("INSERT INTO favorites SET ? ", req.body, function (error, results, fields) {
                if (error) throw error;
                return res.send({ "Add": "Notyet" });
            });
        }
    });


});
//start server
app.listen(3000, () => {

    console.log("Server is running on port 3000..")


});