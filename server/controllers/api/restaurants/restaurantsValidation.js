"use strict";
var helpers = require('../../helpers/helpers');
var isDefined = helpers.isDefined;

var structureRestaurant = {
  "user" : "",
  "pass" : "",
  "email" : "",
  "name" : "",
  "phone":"",
  "address":"",
  "facebook" : "",
  "twitter" : "",
  "instagram" : "",
  "website" : ""
};

function validateRestuarants(structure, next){
  console.log('validando', structure);
  var data = [];
  var testAuthorize = true;
  if(isDefined(structure.email)){
    data.push({
      "email":{
        "status" : "ok",
        "value" : structure.email
      }
    });
  }else{
    data.push({
      "email":{
        "status" : "error",
        "value" : "the email is undefined"
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
      data.push({
        "name" : {
          "status" : "ok",
          "value" : structure.name
        }
      });
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
          "message" : "you have an error in structureRestuarant to be sent",
          "error" : {
            data:data
          },
          "help" : {
            "message" : " you structureRestuarant object must have the following structure",
            "structure": structureRestuarant
          }
        }
      });
  }else{
    res
      .status(400)
      .send({
        "error":{
          "reason" : "badstructure",
          "message" : "you have an error in structureRestuarant to be sent",
          "help" : {
            "message" : " you structureRestuarant object must have the following structure",
            "structure": structureRestuarant
          }
        }
      });
  }
}

module.exports = {
  validateRestuarants : validateRestuarants,
  resToIncorrectStructure : resToIncorrectStructure 
};