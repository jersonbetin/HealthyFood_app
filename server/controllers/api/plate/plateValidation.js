"use strict";
var helpers = require('../../helpers/helpers');
var isDefined = helpers.isDefined;

var structurePlate = {
  "nit" : "",
  "name" : ""
};

function validatePlate(structure, next){
  console.log('validando', structure);
  var data = [];
  var testAuthorize = true;

  if(isDefined(structure.nit)){
      data.push({
        "nit" : {
          "status" : "ok",
          "value" : structure.nit
        }
      });
  }else{
    data.push({
      "nit":{
        "status" : "error",
        "value" : "the nit is undefined"
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

  if(isDefined(structure.idRestaurant)){
      data.push({
        "idRestaurant" : {
          "status" : "ok",
          "value" : structure.idRestaurant
        }
      });
  }else{
    data.push({
      "idRestaurant":{
        "status" : "error",
        "value" : "the idRestaurant is undefined"
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
          "message" : "you have an error in structurePlate to be sent",
          "error" : {
            data:data
          },
          "help" : {
            "message" : " you structurePlate object must have the following structure",
            "structure": structurePlate
          }
        }
      });
  }else{
    res
      .status(400)
      .send({
        "error":{
          "reason" : "badstructure",
          "message" : "you have an error in structurePlate to be sent",
          "help" : {
            "message" : " you structurePlate object must have the following structure",
            "structure": structurePlate
          }
        }
      });
  }
}

module.exports={
	validatePlate : validatePlate,
	resToIncorrectStructure : resToIncorrectStructure
}