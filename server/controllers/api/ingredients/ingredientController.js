"use strict"
var mongoose = require('mongoose');
var ingredientModel = require('../../../models/ingredient').ingredient; 
var helpers = require('../../helpers/helpers');
var validateStructure = require('./ingredientValidation');
var personalCodesStatus = require('./personalCodeclient');

function addIngredient(req, res){
  var validate = validateStructure.validateIngredient;
  validate(req.body, function(textAuthorized, data){
    if(textAuthorized){
      ingredientModel.create({
        name:(req.body.name).toLowerCase(),
        description:req.body.description
      }, function(err, ingredient){
        if(!err){
          var ingredientCreate = {
            name : ingredient.name,
            description : ingredient.description
          };
          res
            .status(201)
            .send({ingredientCreate:ingredientCreate});
        }else{
          if(err.code == 11000){
            personalCodesStatus.res406(res);
          }else{
            personalCodesStatus.res500(res);
          }
        }
      });
    }else{
      validate.resToIncorrectStructure(req, res, data);
    }
  });
}

function getIngredients(req, res){
  ingredientModel.find(function(err, models){
    if(!err){
      res
        .status(200)
        .send({ingredients:models});
    }else{
      personalCodesStatus.res500(res);
    }
  });
}

function getOneIngredient(req, res){
  var nameIngredient = (req.params.id).toLowerCase();
  ingredientModel.findOne({name:nameIngredient}, function(err, model){
    if(!err){
      res
        .status(200)
        .send({ingredient:model});
    }else{
      personalCodesStatus.res500(res);
    }
  });
}

function updateInfoRestaurant(req, res){
  var nameIngredient = (req.params.id).toLowerCase();
  ingredientModel.findOne({name: nameIngredient}, function(err, ingredient){
    if(!err){
      console.log(ingredient);
      if(ingredient){
        updateOneCriterion(req, res, ingredient);
      }else{
        personalCodesStatus.res404(res);
      }
    }else{
      personalCodesStatus.res500(res);
    }
  });
}

function updateOneCriterion(req, res, model){
  var isDefined = helpers.isDefined;

  if (isDefined(req.body.name)) {
    model.name = req.body.name;
  }
  if (isDefined(req.body.description)) {
    model.description = req.body.description;
  }
  model.save(function(err, ingredient){
    if(!err){
      res
        .status(200)
        .send({ingredient : ingredient});
    }else{
      personalCodesStatus.res500(res);
    }
  });
}
module.exports = {
  getIngredients : getIngredients,
  addIngredient : addIngredient,
  getOneIngredient : getOneIngredient,
  updateInfoRestaurant : updateInfoRestaurant
};