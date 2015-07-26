"use strict";
var helpers = require('../../helpers/helpers');
var isDefined = helpers.isDefined;

var structureAdmin = {
  "user" : "",
  "pass" : "",
  "name" : {
    "first" : "",
    "last" : ""
  }
};

function validateAdmins(structure, next){
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
        "value" : "the user is undefined"
      }
    });

    testAuthorize = false;
  }
  if(isDefined(structure.name)){
    if(isDefined(structure.name.first)){
      data.push({
        "name.first" : {
          "status" : "ok",
          "value" : structure.name.first
        }
      });
    }else{
      data.push({
        "name.first": {
          "status" : "error",
          "value" : "the firt name is undefined"
        }
      });

      testAuthorize = false;
    }

    if(isDefined(structure.name.last)){
      data.push({
        "name.last":{
          "status" : "ok",
          "value" : structure.name.last
        }
      });
    }else{
      data.push({
        "name.last":{
          "status" : "error",
          "value" : "the last name is undefined"
        }
      });  

      testAuthorize = false;    
    }
  }else{
    data.push({
      "name":{
        "status" : "error",
        "value" : "the name is undefined"
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
          "message" : "you have an error in structureAdmin to be sent",
          "error" : {
            data:data
          },
          "help" : {
            "message" : " you structureAdmin object must have the following structure",
            "structure": structureAdmin
          }
        }
      });
  }else{
    res
      .status(400)
      .send({
        "error":{
          "reason" : "badstructure",
          "message" : "you have an error in structureAdmin to be sent",
          "help" : {
            "message" : " you structureAdmin object must have the following structure",
            "structure": structureAdmin
          }
        }
      });
  }
}


module.exports = {
  validateAdmins : validateAdmins,
  resToIncorrectStructure : resToIncorrectStructure
};