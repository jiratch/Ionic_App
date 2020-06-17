const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const connectionString = "mongodb+srv://jiratchbelt:jb030339@animeapp-w2qbn.gcp.mongodb.net/test?retryWrites=true&w=majority";

var Token;
const port = process.env.PORT || 3000;


//Connect mongoose

mongoose.connect(connectionString, { useNewUrlParser: true }, function (err) {
    if (err) {
        console.log("Failed connect to mongodb ");
        throw err;
    }
    console.log("Connect to mongodb successfully..");
});


var Anime_Schema = mongoose.Schema({
    status: { type: Number },
    score: { type: Number },
    tags: { type: String },
    is_rewatching: { type: Number },
    num_watched_episodes: { type: Number },
    anime_title: { type: String },
    anime_num_episodes: { type: Number },
    anime_airing_status: { type: Number },
    anime_id: { type: Number },
    anime_studios: { type: String },
    anime_licensors: { type: String },
    anime_season: { type: String },
    has_episode_video: { type: Boolean },
    has_promotion_video: { type: Boolean },
    has_video: { type: Boolean },
    video_url: { type: String },
    anime_url: { type: String },
    anime_image_path: { type: String },
    is_added_to_list: { type: Boolean },
    anime_media_type_string: { type: String },
    anime_mpaa_rating_string: { type: String },
    start_date_string: { type: String },
    finish_date_string: { type: String },
    anime_start_date_string: { type: String },
    anime_end_date_string: { type: String },
    days_string: { type: Number },
    storage_string: { type: String },
    priority_string: { type: String }

})
//Users Schema

var Users_Schema = mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true }

})

//Reviews Schema
var Reviews_Schema = mongoose.Schema({
    Username: { type: String, required: true },
    Description: { type: String, required: true },
    Rating: { type: Number, required: false },
    Animetitle: { type: String, required: true }


})
//Favorite Schema

var Favorites_Schema = mongoose.Schema({

    Username: { type: String, required: true },
    anime_image_path: { type: String, required: true },
    anime_media_type_string: { type: String, required: true },
    anime_mpaa_rating_string: { type: String, required: true },
    anime_title: { type: String, required: true }


})

//Users_model 
var Users_model = mongoose.model('Users', Users_Schema);
//Reviews_model 
var Reviews_model = mongoose.model('Reviews', Reviews_Schema);
//Favorites_model 
var Favorites_model = mongoose.model('Favorites', Favorites_Schema);
//
var Anime_model = mongoose.model('animes', Anime_Schema);



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

app.get('/AnimeData', (req, res) => {

  

        Anime_model.find((err, data) => {
            if (err) { console.log("Error getAnime"); throw err; }
            res.json(data)
            console.log("Animedata")
            console.log("BigAnimedata")
        })
    

});

app.get('/api/AnimeApp/Users', (req, res) => {

   
        Users_model.find((err, data) => {
            if (err) { console.log("Error getdata"); throw err; }
            res.json(data)
            console.log("User")
        })
    
});

app.get('/api/AnimeApp/GetReviews', (req, res) => {

   
        Reviews_model.find((err, data) => {
            if (err) { console.log("Error getreviews"); throw err; }
            res.json(data)
            console.log("Reviews")
        })
    
});

app.get('/api/AnimeApp/GetFavorites', (req, res) => {

   
        Favorites_model.find((err, data) => {
            if (err) { console.log("Error getfav"); throw err; }
            res.json(data)
            console.log("Favorites")
        })
    
});

//Method POST
app.post('/addAnime', (req, res) => {


    
        Anime_model.create(req.body, (err, doc) => {
            if (err) {
                console.log("Failed");
                throw err;
            }
            res.json(doc);
            console.log(doc);

        });
    
});

//
app.post('/api/AnimeApp/login', (req, res) => {
    var Username = req.body.Username;
    var Password = req.body.Password;


        Users_model.findOne({ Username: Username }, (err, user) => {
            if (err) { console.log("Error "); throw err; }

            else if (!user) {
                console.log("Username is not found");
                res.json({ "Found": "Nouser" });
            }
            else {


                Users_model.findOne({ Username: Username, Password: Password }, (err, pass) => {
                    if (err) { console.log("Error "); throw err; }
                    else if (!pass) { console.log("wrongpass"); res.json({ "Found": "wrongpass" }); }
                    else {
                        let privateKey = "this is a private key";
                        jwt.sign({ user: Username }, privateKey, function (err, jwttoken) {
                            Token = jwttoken;
                            res.json({ "Found": "found", "Token": Token, "Username": Username });
                            console.log("found");

                        });

                    }
                })

            }

        })
    

})

app.post('/api/AnimeApp/signup', (req, res) => {
    var Username = req.body.Username;
    var Password = req.body.Password;
    var Email = req.body.Email;



    Users_model.findOne({ Username: Username }, (err, user) => {
        if (err) { console.log("Error "); throw err; }
        else if (user) {
            console.log("Username is already used");
            res.json({ "Use": "Used" });
        }
        else {
            res.json({ "Use": "Notyet" });
            Users_model.create(req.body, (err, doc) => {
                if (err) {
                    console.log("Failed");
                    throw err;
                }
            })

        }
    });
});

//POST addReviews

app.post('/api/AnimeApp/addReviews', (req, res) => {
    var Username = req.body.Username;
    var Description = req.body.Description;
    var Rating = req.body.Rating;
    var Animetitle = req.body.Animetitle;

    Reviews_model.create(req.body, (err, doc) => {
        if (err) {
            console.log("Failed");
            throw err;
        }
        res.json(doc);
        console.log(doc);
    });
});
//POST AddFavorite

app.post('/api/AnimeApp/addFavorite', (req, res) => {
    var Username = req.body.Username;
    var anime_title = req.body.anime_title;

    Favorites_model.findOne({ Username: Username, anime_title: anime_title }, (err, data) => {
        if (err) { console.log("Error "); throw err; }
        else if (data) {
            console.log("Username is already used");
            res.json({ "Add": "Added" });
        }
        else {

            Favorites_model.create(req.body, (err, doc) => {
                if (err) {
                    console.log("Failed");
                    throw err;
                }
                else {
                    console.log("Add Favdata successfully");
                    res.json({ "Add": "Notyet", "doc": doc });
                }
            })

        }
    });
});
//DELETE

app.post('/api/AnimeApp/deleteFavorite', (req, res) => {

    let anime_title = req.body.anime_title;
    let Username = req.body.Username;

    Favorites_model.deleteOne({ Username: Username, anime_title: anime_title }, (err, data) => {
        if (err) {
            console.log("Error "); res.sendStatus(500);
            throw err;
        }
        else {
            res.json({ delete: "success" });
            console.log(`delete doc ${anime_title} from user ${Username} successfully`);
        }

    });
});

app.post('/api/AnimeApp/deleteReviews', (req, res) => {

    let Animetitle = req.body.Animetitle;
    let Username = req.body.Username;
    let Description = req.body.Description;
    Reviews_model.deleteOne({ Username: Username, Animetitle: Animetitle, Description: Description }, (err, data) => {
        if (err) {
            console.log("Error "); res.sendStatus(500);
            throw err;
        }
        else {
            res.json({ delete: "success" });
            console.log(`delete reviews doc ${Animetitle} from user ${Username}  with Description = ${Description} successfully`);
        }

    });
});

//start server
app.listen(port, () => {

    console.log(`Server is running on port = ${port}`)


});