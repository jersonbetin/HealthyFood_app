'use strict';
var mongoose = require('mongoose');
var plateModel = require('../../../models/menu').plate;
var restaurantModel = require('../../../models/restaurant').restaurant;  
var menuModel = require('../../../models/menu').menu;
var plateIngredientModel = require('../../../models/menu').plateIngredient;
var ingredientModel = require('../../../models/ingredient').ingredient;
var plateIngredientModel = require('../../../models/menu').plateIngredient;
var helpers = require('../../helpers/helpers');
var validateStructure = require('./plateValidation');
var personalCodesStatus = require('./personalCodePlate');


// code
function res404Restaurant(res){          
  res
    .status(404)
    .send({
      "error":{
        "error":"diseaseDoesntExists",
        "info" : "This error occurs when an restaurant doesn't exists"
      }
  });
}


//add plate and menu
function addPlateAndMenu(req, res){
	var structure = {
		idRestaurant:req.params.id,
		nit : req.body.nit,
		name : req.body.name
	};
	validateStructure.validatePlate(structure, function(testAuthorize, data){
    if(testAuthorize){
    	restaurantModel.findOne({user:req.params.id}, function(err, restaurant){
				if(!err){
					if(restaurant){
			    	plateModel.create({
			    		nit:req.body.nit,
			    		name:req.body.name
			    	}, function(err, plate){
			    		if(!err){
			    			menuModel.create({
			    				idRestaurant: restaurant._id,
			  					idPlate:plate._id
			    			}, function(err, menu){
			    				if(!err){
			    					res
			    						.status(201)
			    						.send({
			    							menu:menu,
			    							plate:plate
			    						});
			    				}else{
			    					personalCodesStatus.res500(res);
			    				}
			    			});
			    		}else{
			    			if(err.code==11000){    				
			              personalCodesStatus.res406(res);
			    			}else{
			    				personalCodesStatus.res500(res);
			    			}
			    		}
			    	});
			    }else{
						res404Restaurant(res);
			    }
		    }else{
					personalCodesStatus.res500(res);
		    }
		  });
    }else{
    	validateStructure.resToIncorrectStructure(req, res, data);
    }
	});
}


//get all plates or menu from restaurant
function getMenu(req, res){
	restaurantModel.findOne({user:req.params.id}, function(err, restaurant){
		if(!err){
			if(restaurant){				
				menuModel.find({idRestaurant:restaurant._id}).populate('idPlate').exec(function(err, menu){
					if(!err){
						if(menu){
							res
								.status(200)
								.send({menu:menu});
						}else{
							personalCodesStatus.res404(res);
						}
					}else{
						personalCodesStatus.res500(res);
					}
				});
			}else{
				res404Restaurant(res);
			}
		}else{
			personalCodesStatus.res500(res);
		}
	});
}

//get one plate from restaurant
function getOnePlate(req, res){
	console.log(req.params.plate);
	restaurantModel.findOne({user:req.params.id}, function(err, restaurant){
		if(!err){
			if(restaurant){
				plateModel.findOne({nit:req.params.plate}, function(err, plate){
					if(!err){
						menuModel.findOne({idRestaurant:restaurant._id, idPlate:plate._id}).populate('idPlate').exec(function(err, plateRestaurant){
							if(!err){
								if(plate){
									res
										.status(200)
										.send({plateRestaurant:plateRestaurant});
								}else{
									personalCodesStatus.res404(res);
								}
							}else{
								personalCodesStatus.res500(res);
							}
						});
					}else{
						personalCodesStatus.res500(res);
					}
				});
			}else{
				res404Restaurant(res);
			}
		}else{
			personalCodesStatus.res500(res);
		}
	});
}

function deletePlate(req, res){
	restaurantModel.findOne({user:req.params.id}, function(err, restaurant){
		if(!err){
			if(restaurant){
				plateModel.findOne({nit:req.params.plate}, function(err, plate){
					if(!err){
		        plate.remove(function(err){
		          if(!err){            
		            res
		            .status(200)
		            .send({
		              "message":"the plate was removed"
		            });
		          }else{
		            personalCodesStatus.res500(res);
		          }
		        });		  
  			}else{
						personalCodesStatus.res500(res);
					}
				});
			}else{
				res404Restaurant(res);
			}
		}else{
			personalCodesStatus.res500(res);
		}
	});
}

function AddPlateIngredient(req, res){
	console.log(req.body, req.params);
	plateModel.findOne({nit: req.params.id}, function(err, plate){
		if(!err){
			if(plate){
				ingredientModel.findOne({_id: req.body.ingredient}, function(err, ingredient){
					if(!err){
						if(ingredient){
							var plateIngredient = new plateIngredientModel({
								idIngredient: ingredient._id,
								idPlate: plate._id
							});
							plateIngredient.save(function(err){
								if(!err){
									res
									.status(201)
									.send({plateIngredient:plateIngredient});
								}else{
									personalCodesStatus.res500(res);									
								}
							});
						}else{
							res
							.status(404)
							.send({
								"error":"ingredient error",
								info: "Ingrediente does´t exist"
							});
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
	addPlateAndMenu : addPlateAndMenu,
	getMenu : getMenu,
	getOnePlate : getOnePlate,
	deletePlate : deletePlate,
	AddPlateIngredient : AddPlateIngredient
};