const bodyParser = require('body-parser');
const express = require('express');
const multer = require('multer');
const _ = require('underscore')

var app = express();

var data = [
    {
        name: 'Han Solo',
        occupation: 'Smuggler',
        debt: true,
        weapon: 'Blaster Pistol',
        id: 1
    }, {
        name: 'Luke Skywalker',
        occupation: 'Jedi Knight',
        debt: false,
        weapon: 'Lightsaber',
        id: 2
    }
];

dataKeys = [ 'name', 'occupation', 'weapon' ];


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(multer().array());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/characters', function (req, res) {
    res.send(data);
});


app.get('/characters/:id', function (req, res) {
    var id = Number(req.params.id);
    var character = data.filter(function(character){
        return character.id === id;
    })[0]

    if (!character){
        res
            .status(404)
            .send({error: "Character not found"})
        ;
    }
    res
        .status(201)
        .send(character)
    ;
});

app.post('/characters', function (req, res) {
    var character = {
        name: req.body.name,
        occupation: req.body.occupation,
        debt: req.body.debt || false,
        weapon: req.body.weapon,
        id: data.length + 1
    };

    var badData = dataKeys.filter(function (key) {
        return !character[key];
    });

    if (badData.length) {
        res
            .status(400)
            .send({ error: 'Bad data: ' + badData.join(', ') })
        ;
        return;
    }

    data.push(character);

    res
        .status(201)
        .send({ id: character.id })
    ;
});


var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('App listening at http://%s:%s', host, port)
});
