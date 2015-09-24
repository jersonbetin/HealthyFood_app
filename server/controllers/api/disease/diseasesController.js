'use strict';
var mongoose = require('mongoose');
var diseaseModel  =  require('../../../models/diseases').disease;
var diseaseClientModel  =  require('../../../models/diseases').diseaseClient;
var clientModel = require('../../../models/clients').client;
var helpers = require('../../helpers/helpers');
var validateStructure = require('./diseasesValidation');
var personalCodesStatus = require('./personalCodeDiseases');

//add diseases
function addDisease(req, res){
	var validation = validateStructure.validateDiseases;
	validation(req.body, function(testAuthorize, data){
		if(testAuthorize){
			diseaseModel.create({
				name:req.body.name,
				description : req.body.description
			}, function(err, disease){
				if(!err){
					var diseaseCreate = {
						"name":disease.name,
						"description":disease.description
					};
					res
						.status(201)
						.send({diseaseCreate:diseaseCreate});

				}else{
					personalCodesStatus.res500(res);
				}
			});
		}else{
			validateStructure.resToIncorrectStruct(req, res, data);
		}
	});
}

//get diseases
function getDiseases(req, res){
	diseaseModel.find(function(err, diseases){
		if(!err){
			if(diseases){
				res
					.status(200)
					.send({diseases:diseases});
			}else{
				personalCodesStatus.res404(res);
			}
		}else{
			personalCodesStatus.res500(res);
		}
	});
}

//get one disease
function getOneDisease(req, res){
	var id = req.params.id;
	diseaseModel.findOne({_id : id}, function(err, disease){
		if(!err){
			console.log("paso por aqui");
			if(disease){
				res
					.status(200)
					.send({disease:disease});
			}else{
				personalCodesStatus.res404(res);
			}
		}else{
			personalCodesStatus.res500(res);
		}
	});
}

//update one criterion 
function updateOneCriterion(req, res, model){
  var isDefined = helpers.isDefined;
  if (isDefined(req.body.name)) {
    model.name = req.body.name;
  }

  if (isDefined(req.body.description)) {
    model.description = req.body.description;
  }

  model.save(function(err, disease){
    if(!err){
      res
        .status(200)
        .send({disease : disease});
    }else{
      personalCodesStatus.res500(res);
    }
  });
}

function updateInfoDisease(req, res){
  console.log(req.params.id);
  diseaseModel.findOne({_id: req.params.id}, function(err, disease){
    if(!err){
      console.log(disease);
      if(disease){
        console.log('entro 1');
        updateOneCriterion(req, res, disease);
      }else{
        personalCodesStatus.res404(res);
      }
    }else{
      personalCodesStatus.res500(res);
    }
  });
}

//delete disease
function deleteDisease(req, res){
	diseaseModel.findOne({_id:req.params.id}, function(err, disease){
    console.log(err);
    if(!err){
      if(disease){
        disease.remove(function(err){
          if(!err){            
            res
            .status(200)
            .send({
              "message":"the disease was removed"
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

//add diseases client
function addDiseaseClient(req, res){
	clientModel.findOne({email:req.params.id}, function(err, client){
		if(!err){
			console.log(client);
			if(client){
				var structure = {
					idDisease:req.body.idDisease,
					idClient : client._id
				};
				validateStructure.validateDiseaseClient(structure, function(testAuthorize, data){
					if(testAuthorize){
						diseaseClientModel.create({
							idDisease : req.body.idDisease,
							idClient : client._id
						}, function(err, diseaseClient){
							if(!err){
								res
									.status(201)
									.send({diseaseClient:diseaseClient});
							}else{
								personalCodesStatus.res500(res);
							}
						});
					}else{
						validateStructure.resToIncorrectStructureDiseaseClient(req, res, data);
					}
				});				
			}else{				
				res
					.status(404)
					.send({
						"error":{
							"error":"userDoesntExists",
							"info" : "This error occurs when an client doesn't exists"
						}
				});
			}
		}else{
			personalCodesStatus.res500(res);
		}
	});	
}

//get diseases client
function getDiseasesClient(req, res){
	console.log(req.params.id);
	clientModel.findOne({email:req.params.id}, function(err, client){
		if(!err){
			if(client){
				diseaseClientModel.find({idClient: client._id}).populate("idDisease").exec(function(err, diseasesClient){
					if(!err){
						if(diseaseClient){
							res
							.status(200)
							.send({diseasesClient:diseasesClient});
						}else{
							personalCodesStatus.res404(res);
						}						
					}else{
						personalCodesStatus.res500(res);
					}
				});				
			}else{								
					res
						.status(404)
						.send({
							"error":{
								"error":"userDoesntExists",
								"info" : "This error occurs when an client doesn't exists"
							}
					});
			}
		}else{
			personalCodesStatus.res500(res);
		}
	});
}

//Delete disease client
function deleteDiseaseClient(req, res){
	console.log(req.params.id);
	clientModel.findOne({email:req.params.id}, function(err, client){
		if(!err){
			if(client){
				diseaseClientModel.findOne({idDisease:req.body.idDisease, idClient:client._id}, function(err, diseaseClient){
					if(!err){
						if(diseaseClient){
							diseaseClient.remove(function(err){
								if(!err){
									res
										.status(200)
										.send({"message":"the disease client was removed"});
								}else{
									personalCodesStatus.res500(res);
								}
							});
						}else{
							res
								.status(404)
								.send({
									"error":{
										"error":"diseaseClientDoesntExists",
										"info" : "This error occurs when an disease client doesn't exists"
									}
							});							
						}
					}else{
						personalCodesStatus.res500(res);
					}
				});

			}else{
				res
						.status(404)
						.send({
							"error":{
								"error":"userDoesntExists",
								"info" : "This error occurs when an client doesn't exists"
							}
					});
			}
		}else{
			personalCodesStatus.res500(res);
		}
	});
}

module.exports = {
	addDisease : addDisease,
	getDiseases : getDiseases,
	getOneDisease : getOneDisease,
	updateInfoDisease : updateInfoDisease,
	deleteDisease : deleteDisease,
	addDiseaseClient : addDiseaseClient,
	getDiseasesClient : getDiseasesClient,
	deleteDiseaseClient : deleteDiseaseClient
};