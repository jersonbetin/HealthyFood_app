"use strict";
var helpers = require('../../helpers/helpers');
var isDefined = helpers.isDefined;

var structureIngredient = {
  "name" : "",
  "description" : ""
};

var structureDiseaseIngredient = {
  "isRecommended":"",
  "idDisease": "",
  "idIngredient": ""
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

function validateDiseaseIngredient(structure, next){
  console.log('validando', structure);
  var data = [];
  var testAuthorize = true;

  if(isDefined(structure.isRecommended)){
      data.push({
        "isRecommended" : {
          "status" : "ok",
          "value" : structure.isRecommended
        }
      });
  }else{
    data.push({
      "isRecommended":{
        "status" : "error",
        "value" : "the isRecommended is undefined"
      }
    });  

    testAuthorize = false;
  }

  if(isDefined(structure.idDisease)){
      data.push({
        "idDisease" : {
          "status" : "ok",
          "value" : structure.idDisease
        }
      });
  }else{
    data.push({
      "idDisease":{
        "status" : "error",
        "value" : "the idDisease is undefined"
      }
    });  

    testAuthorize = false;
  }

  if(isDefined(structure.idIngredient)){
      data.push({
        "idIngredient" : {
          "status" : "ok",
          "value" : structure.idIngredient
        }
      });
  }else{
    data.push({
      "idIngredient":{
        "status" : "error",
        "value" : "the idIngredient is undefined"
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

function resToIncorrectStructureDiseaseIng(req, res, data){
  if(isDefined(req.query.errors) && req.query.errors=="verbose"){
    res
      .status(400)
      .send({
        "error":{
          "reason" : "badstructure",
          "message" : "you have an error in structureDiseaseIngredient to be sent",
          "error" : {
            data:data
          },
          "help" : {
            "message" : " you structureDiseaseIngredient object must have the following structure",
            "structure": structureDiseaseIngredient
          }
        }
      });
  }else{
    res
      .status(400)
      .send({
        "error":{
          "reason" : "badstructure",
          "message" : "you have an error in structureDiseaseIngredient to be sent",
          "help" : {
            "message" : " you structureDiseaseIngredient object must have the following structure",
            "structure": structureDiseaseIngredient
          }
        }
      });
  }
}

module.exports = {
  validateIngredient : validateIngredient,
  resToIncorrectStructure : resToIncorrectStructure,
  validateDiseaseIngredient : validateDiseaseIngredient,
  resToIncorrectStructureDiseaseIng : resToIncorrectStructureDiseaseIng
};