"use strict";
var helpers = require('../controllers/helpers/helpers');
var isDefined = helpers.isDefined;

var structureLogin = {
  "user" : "",
  "pass" : "",
  "rol": ""
};


function validateLogin(structure, next){
  console.log('validando', structure);
  var data = [];
  var testAuthorize = true;
  if(isDefined(structure.user)){
    data.push({
      "user":{
        "status" : "ok",
        "value" : structure.user
      }
    });
  }else{    
    data.push({
      "user":{
        "status" : "error",
        "value" : "the user is undefined"
      }
    });
    testAuthorize = false;
  }

  if(isDefined(structure.pass)){
    data.push({
      "pass":{
        "status" : "ok",
        "value" : structure.pass
      }
    });
  }else{
    data.push({
      "pass":{
        "status" : "error",
        "value" : "the pass is undefined"
      }
    });

    testAuthorize = false;
  }

  if(isDefined(structure.rol)){
    data.push({
      "rol":{
        "status" : "ok",
        "value" : structure.rol
      }
    });
  }else{
    data.push({
      "rol":{
        "status" : "error",
        "value" : "the rol is undefined"
      }
    });

    testAuthorize = false;
  }
  next(testAuthorize, data);
}

function resToIncorrectStructure(req, res, data){
  if(isDefined(req.query.errors) && req.query.errors=="verbose"){
    res
      .status(400)
      .send({
        "error":{
          "reason" : "badstructure",
          "message" : "you have an error in structureLogin to be sent",
          "error" : {
            data:data
          },
          "help" : {
            "message" : " you structureLogin object must have the following structure",
            "structure": structureLogin
          }
        }
      });
  }else{
    res
      .status(400)
      .send({
        "error":{
          "reason" : "badstructure",
          "message" : "you have an error in structureLogin to be sent",
          "help" : {
            "message" : " you structureLogin object must have the following structure",
            "structure": structureLogin
          }
        }
      });
  }
}

module.exports = {
  validateLogin : validateLogin,
  resToIncorrectStructure : resToIncorrectStructure
}