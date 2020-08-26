const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const app = express();

const passport = require("passport");
app.use(passport.initialize());
require("./middleware/passport")(passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log("Mongo Connection Successfull"))
        .catch((err) => console.log(`err : ${err}`));

app.get('/', (req, res) => {
    res.json("hello");
});

app.use('/api/users/', require('./routes/api/user'));

app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});