"use strict";
var helpers = require('../../helpers/helpers');
var isDefined = helpers.isDefined;

var structureDisease = {
  "name": "",
  "description": ""
};

var structureDiseaseClient = {
  "idDisease": "",
  "idClient": ""
};

function validateDiseases(structure, next){
  console.log('validando', structure);
  var data = [];
  var testAuthorize = true;
  if(isDefined(structure.name)){
    data.push({
      "name":{
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
};

function validateDiseaseClient(structure, next){
  console.log('validando disease client', structure);
  var data = [];
  var testAuthorize = true;
  if(isDefined(structure.idDisease)){
    data.push({
      "idDisease":{
        "status" : "ok",
        "value" : structure.idDisease
      }
    });
  }else{
    data.push({
      "idDisease":{
        "status": "error",
        "value" : "the id disease is undefined"
      }
    });
    testAuthorize = false;
  }
  if(isDefined(structure.idClient)){
    data.push({
      "idClient":{
        "status" : "ok",
        "value" : structure.idClient
      }
    });
  }else{
    data.push({
      "idClient":{
        "status": "error",
        "value" : "the id disease is undefined"
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
          "message" : "you have an error in structureDisease to be sent",
          "error" : {
            data:data
          },
          "help" : {
            "message" : " you structureDisease object must have the following structure",
            "structure": structureDisease
          }
        }
      });
  }else{
    res
      .status(400)
      .send({
        "error":{
          "reason" : "badstructure",
          "message" : "you have an error in structureDisease to be sent",
          "help" : {
            "message" : " you structureDisease object must have the following structure",
            "structure": structureDisease
          }
        }
      });
  }
}

function resToIncorrectStructureDiseaseClient(req, res, data){
  if(isDefined(req.query.errors) && req.query.errors=="verbose"){
    res
      .status(400)
      .send({
        "error":{
          "reason" : "badstructure",
          "message" : "you have an error in structureDiseaseClient to be sent",
          "error" : {
            data:data
          },
          "help" : {
            "message" : " you structureDiseaseClient object must have the following structure",
            "structure": structureDiseaseClient
          }
        }
      });
  }else{
    res
      .status(400)
      .send({
        "error":{
          "reason" : "badstructure",
          "message" : "you have an error in structureDiseaseClient to be sent",
          "help" : {
            "message" : " you structureDiseaseClient object must have the following structure",
            "structure": structureDiseaseClient
          }
        }
      });
  }
}

module.exports = {
  validateDiseases : validateDiseases,
  resToIncorrectStructure : resToIncorrectStructure ,
  validateDiseaseClient : validateDiseaseClient,
  resToIncorrectStructureDiseaseClient : resToIncorrectStructureDiseaseClient
};