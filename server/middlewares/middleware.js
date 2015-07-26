'use strict'
var config = require('../controllers/helpers/config');
var isDefined = require('../controllers/helpers/helpers').isDefined;
var service = require('../controllers/helpers/service');

function res401(res){
  res
    .status(401)
    .send({
      err:'tokenUnauthorized',
      message: 'The request requires authentication. The server might return this response for a page behind a login.'
    });
}

function res500(res){
  res
    .status(500)
    .send({
      "error":{
        "error": "somethingIsWrongWithUs",
        "info" : "This error occurs with our server, we expect fix soon"
      }
    });
}

function checkToken(req, res, next){
  //comparamos si el token enviado es el autorizad
  console.log(req.headers.authorization);
  if(!isDefined(req.headers.authorization) || !(config.TOKEN_SECRET == req.headers.authorization)){
    // console.log('Primero');
    res401(res);
  }else{
    // console.log('segundo');
    next();    
  }
  
  //vemos si el token expiro
  // falta programar

}


function auth(req, res, next){
  console.log('pasando por aqui');
  next();
}

module.exports = {
  checkToken : checkToken,
  auth : auth
};