"use strict";

var express = require("express");
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');

var apiRoutes = require("./routes/apiRoutes");



function serverListeningHandler(){
  console.log('Server listening at http://'+server.configuration.host +':'+server.configuration.port);
}

function start(){
    mongoose.connect('mongodb://127.0.0.1/HealthyFood');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error: '));
    db.once('open', function callback(){
      app.use(bodyParser.urlencoded({ extended : true }));      
      app.use(bodyParser.json());
      console.log('conexion establecida');
      console.log('Database HealthyFood');
      app.use(logger());
      app.use(cors());
      apiRoutes(app);
      app.listen(server.configuration.port, serverListeningHandler);
    });

}


var server = {
  configuration: {
    host: "localhost",
    port: "3000"
  },
  start: start
}

module.exports = server;
