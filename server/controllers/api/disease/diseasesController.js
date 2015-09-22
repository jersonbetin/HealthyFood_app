'use strict';
var mongoose = require('mongoose');
var diseaseModel  =  require('../../../models/diseases').disease;
var diseaseClientModel  =  require('../../../models/diseases').diseaseClient;
var helpers = require('../../helpers/helpers');
var validateStructure = require('./diseasesValidation');
var personalCodesStatus = require('./personalCodeDiseases');

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

module.exports = {
	addDisease : addDisease
};