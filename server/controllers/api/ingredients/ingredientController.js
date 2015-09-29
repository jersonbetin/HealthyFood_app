"use strict"
var mongoose = require('mongoose');
var ingredientModel = require('../../../models/ingredient').ingredient; 
var diseaseIngredientModel = require('../../../models/ingredient').deseaseIngredient;
var diseaseModel = require('../../../models/diseases').disease;
var helpers = require('../../helpers/helpers');
var validateStructure = require('./ingredientValidation');
var personalCodesStatus = require('./personalCodeclient');

//add new ingredient
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

//get all ingredients in the data base
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

//get one ingredient in the data base
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

//update one criterion
function updateInfoIngredient(req, res){
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

//delete ingredient
function deleteIngredient(req, res){
  ingredientModel.findOne({name:req.params.id}, function(err, ingredient){
    console.log(err);
    if(!err){
      if(ingredient){
        ingredient.remove(function(err){
          if(!err){            
            res
            .status(200)
            .send({
              "message":"the ingredient was removed"
            });
          }else{
            personalCodesStatus.res500(res);
          }
        });
      }else{
        personalCodesStatus.res404(res);
      }
    }else{
      personalCodesStatus.res500(res);
    }
  });
}


// code disease ingredient 
function res404Disease(res){          
  res
    .status(404)
    .send({
      "error":{
        "error":"diseaseDoesntExists",
        "info" : "This error occurs when an disease doesn't exists"
      }
  });
}
//add disease ingredient
function addDiseaseIngredient(req, res){
  console.log(diseaseIngredientModel);
  diseaseModel.findOne({_id:req.params.id}, function(err, disease){
    if(!err){
      if(disease){        
        var structure = {
          isRecommended : req.body.isRecommended,
          idDisease : req.params.id,
          idIngredient : req.body.idIngredient
        };
        validateStructure.validateDiseaseIngredient(structure, function(testAuthorize, data){
          if(testAuthorize){
            diseaseIngredientModel.create(structure, function(err, diseaseIngredient){
              if(!err){
                var diseaseIngredientCreate = {
                  isRecommend: diseaseIngredient.isRecommended,
                  idDisease : diseaseIngredient.idDisease,
                  idIngredient : diseaseIngredient.idIngredient
                };
                res
                  .status(201)
                  .send({
                    diseaseIngredientCreate : diseaseIngredientCreate
                  });
              }else{
                personalCodesStatus.res500(res);
              }
            });
          }else{
            validateStructure.resToIncorrectStructureDiseaseIng(req, res, data);
          }
        });
      }else{
        res404Disease(res);
      }
    }else{
      personalCodesStatus.res500(res);
    }
  });
}

//get diseases ingredient
function getDiseasesIngredient(req, res){
  console.log(req.params.id);
  diseaseModel.findOne({_id:req.params.id}, function(err, disease){
    if(!err){
      if(disease){
        diseaseIngredientModel.find({idDisease: disease._id}).populate("idIngredient").exec(function(err, diseasesIngredient){
          if(!err){
            if(diseasesIngredient){
              res
              .status(200)
              .send({diseasesIngredient:diseasesIngredient});
            }else{
              personalCodesStatus.res404(res);
            }           
          }else{
            personalCodesStatus.res500(res);
          }
        });       
      }else{                
          res404Disease(res);
      }
    }else{
      personalCodesStatus.res500(res);
    }
  });
}

//Delete disease ingredient
function deleteDiseaseIngredient(req, res){
  console.log(req.params.id);
  diseaseModel.findOne({_id:req.params.id}, function(err, disease){
    if(!err){
      if(disease){
        diseaseClientModel.findOne({idIngredient:req.body.idDisease, idDisease:disease._id}, function(err, diseaseIngredient){
          if(!err){
            if(diseaseIngredient){
              diseaseIngredient.remove(function(err){
                if(!err){
                  res
                    .status(200)
                    .send({"message":"the disease ingredient was removed"});
                }else{
                  personalCodesStatus.res500(res);
                }
              });
            }else{
              res404Disease(res);
            }
          }else{
            personalCodesStatus.res500(res);
          }
        });

      }else{
        personalCodesStatus.res404(res);
      }
    }else{
      personalCodesStatus.res500(res);
    }
  });
}
module.exports = {
  getIngredients : getIngredients,
  addIngredient : addIngredient,
  getOneIngredient : getOneIngredient,
  updateInfoIngredient : updateInfoIngredient,
  deleteIngredient : deleteIngredient,
  addDiseaseIngredient : addDiseaseIngredient,
  getDiseasesIngredient : getDiseasesIngredient,
  deleteDiseaseIngredient : deleteDiseaseIngredient
};