'use strict'
var config = require('../controllers/helpers/config');
var isDefined = require('../controllers/helpers/helpers').isDefined;
var createToken = require('../controllers/helpers/service').createToken;
var helpers = require('../controllers/helpers/helpers');
var middlewareValidation = require('./middlewareValidation');
var jwt = require('jwt-simple');
var moment = require('moment');
var adminsModel = require('../models/admin').admin;
var clientsModel = require('../models/clients').client; 
var restaurantModel = require('../models/restaurant').restaurant;

//Tu petición no tiene cabecera de autorización
function res403(res){
  res
    .status(403)
    .send({
      err:'tokenUnauthorized',
      message: 'Your request has no authorization header'
    });
}

function res404(res){
  res
    .status(404)
    .send({
      err:'requestNotFaund',
      message: 'Your request not faund header'
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
  //comparamos si el token enviado es el autorizado
  console.log(req.headers.authorization);
  if(isDefined(req.headers.authorization)){ // || !(config.TOKEN_SECRET == req.headers.authorization)){
    var token = req.headers.authorization;
    var payload = jwt.decode(token, config.TOKEN_SECRET);
    console.log(payload);
    if(payload.exp<=moment().unix()){
      res
        .status(401)
        .send({message: "El token ha expirado"});
    }else{
      req.user = {
        id:payload.sub,
        rol:payload.rol
      };
      next();    
    }
  }else{
    res403(res);
  }
}


function auth(req, res, next){
  console.log('Entro aqui',req.body);
  var validation = middlewareValidation.validateLogin;
  validation(req.body, function(textAuthorized, data){
    if(textAuthorized){
      var passSha1 = helpers.encrypt((req.body.pass).toLowerCase());
      if(req.body.rol=="admin"){
        adminsModel.findOne({user:(req.body.user).toLowerCase(), password:passSha1}, function(err, admin){
          console.log(admin);
          if(err){
            res500(res);
          }else{
            if(admin){
              var user = {
                _id:admin._id,
                rol:"admin"
              };
              var service = createToken(user);
              res
              .status(200)
              .send({
                token:service
              })
            }else{
              res404(res);
            }
          }
        });
      }else{
        if(req.body.rol=="client"){
          clientsModel.findOne({email:(req.body.user).toLowerCase(), password:passSha1}, function(err, client){
            console.log(client);
            if(err){
              res500(res);
            }else{
              if(client){
                var user = {
                  _id:client._id,
                  rol:"client"
                };
                var service = createToken(user);
                res
                .status(200)
                .send({
                  token:service
                })
              }else{
                res404(res);
              }
            }
          });
        }else{
          if(req.body.rol=="restaurant"){
            restaurantModel.findOne({user:(req.body.user).toLowerCase(), password:passSha1}, function(err, restaurant){
              console.log(restaurant);
              if(err){
                res500(res);
              }else{
                if(restaurant){
                  var user = {
                    _id:restaurant._id,
                    rol:"restaurant"
                  };
                  var service = createToken(user);
                  res
                  .status(200)
                  .send({
                    token:service
                  })
                }else{
                  res404(res);
                }
              }
            });
          }else{
            res
            .status(404)
            .send({
              "error":{
                "message":"rol not faund",
                "error":"rolNotFound"
              }
            });
          }
        }
      }
    }else{
      middlewareValidation.resToIncorrectStructure(req, res, data);
    }
  });
}

module.exports = {
  checkToken : checkToken,
  auth : auth
};