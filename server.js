const bodyParser = require('body-parser');
const express = require('express');
const multer = require('multer');
const _ = require('underscore');

dataKeys = ['name', 'occupation', 'weapon'];

function createServer(data) {
  const app = express();

  app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'DELETE,GET,HEAD,PATCH,PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  app.use(multer().array());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.get('/characters', (_, res) => res.send(data));

  app.delete('/characters/:id', (req, res) => {
    let id = Number(req.params.id);
    let charExists = false;
    let new_data = _.reject(data, character => {
      if (character.id === id) {
        charExists = true;
        return character.id === id;
      } else {
        return false;
      }
    });
    if (charExists) {
      data = new_data;
      res.send('Character has been successfully deleted');
    } else {
      res.status(404).send('Character not found');
    }
  });

  app.get('/characters/:id', (req, res) => {
    let id = Number(req.params.id);
    let character = data.filter(character => {
      return character.id === id;
    })[0];

    if (!character) {
      res.status(404).send({ error: 'Character not found' });
    }
    res.send(character);
  });

  function characterUpdate(req, res) {
    let id = Number(req.params.id);
    let index = _.findIndex(data, character => {
      return character.id === id;
    });

    if (index > -1) {
      //   console.log(req.body);
      data[index].name = req.body.name || data[index].name;
      data[index].occupation = req.body.occupation || data[index].occupation;
      data[index].weapon = req.body.weapon || data[index].weapon;
      data[index].debt = req.body.debt || data[index].debt;
      res.send(data[index]);
    } else {
      res.status(404).send('Character not found');
    }
  }

  app.patch('/characters/:id', characterUpdate);
  app.put('/characters/:id', characterUpdate);

  app.post('/characters', (req, res) => {
    let character = {
      name: req.body.name,
      occupation: req.body.occupation,
      debt: req.body.debt || false,
      weapon: req.body.weapon,
      id: data.length + 1
    };

    let badData = dataKeys.filter(key => {
      return !character[key];
    });

    if (badData.length) {
      res.status(400).send({ error: 'Bad data: ' + badData.join(', ') });
      return;
    }

    data.push(character);

    res.status(201).send(character);
  });

  let server = app.listen(process.env.PORT || 3000, () => {
    console.log(server.address());
    let host = server.address().address;
    let port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
  });

  return server;
}

module.exports = createServer;

let initialData = [
  {
    name: 'Han Solo',
    occupation: 'Smuggler',
    debt: true,
    weapon: 'Blaster Pistol',
    id: 1
  },
  {
    name: 'Luke Skywalker',
    occupation: 'Jedi Knight',
    debt: false,
    weapon: 'Lightsaber',
    id: 2
  }
];

createServer(initialData);
