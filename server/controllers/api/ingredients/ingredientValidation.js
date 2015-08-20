"use strict";
var helpers = require('../../helpers/helpers');
var isDefined = helpers.isDefined;

var structureIngredient = {
  "name" : "",
  "description" : ""
};

function validateIngredient(structure, next){
  console.log('validando', structure);
  var data = [];
  var testAuthorize = true;

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
          "message" : "you have an error in structureIngredient to be sent",
          "error" : {
            data:data
          },
          "help" : {
            "message" : " you structureIngredient object must have the following structure",
            "structure": structureIngredient
          }
        }
      });
  }else{
    res
      .status(400)
      .send({
        "error":{
          "reason" : "badstructure",
          "message" : "you have an error in structureIngredient to be sent",
          "help" : {
            "message" : " you structureIngredient object must have the following structure",
            "structure": structureIngredient
          }
        }
      });
  }
}

module.exports = {
  validateIngredient : validateIngredient,
  resToIncorrectStructure : resToIncorrectStructure 
};