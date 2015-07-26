var mongoose = require('mongoose');
var adminsModel = require('../../../models/admin').admin;
var validateStructure = require('./admins_validation');
var helpers = require('../../helpers/helpers');
var personalCodesStatus = require('./personalCodeAdmin');

//add new admin
function addAdmin(req, res){
  var validate = validateStructure.validateAdmins;
  validateStructure.validateAdmins(req.body, function(testAuthorized, data){   
    if(testAuthorized){
      var passSha1 = helpers.encrypt(req.body.pass);
      adminsModel.create({
        user:req.body.user,
        password: passSha1,
        name: {
          first : req.body.name.first,
          last : req.body.name.last
        }
      }, function(err, admin){
          if(!err){
            var adminCreate = {
              "user" : admin.user,
              "name" : {
                "first" : admin.name.first,
                "last" : admin.name.last
              }
            };
            res
              .status(201)
              .send({adminCreate:adminCreate});
          }else{
            if(err.code == 11000){
              personalCodesStatus.res406(res);
            }else{
              personalCodesStatus.res500(res);
            }            
          }
        }
      );
    }else{
      validateStructure.resToIncorrectStructure(req, res, data);
    }
  });
}

//get all admins in the data base
function getAllAdmins(req, res){
  adminsModel.find({}, {password:0}, function(err, admins){
    if(!err){
      res
      .status(200)
      .send({
        admins:admins
      });
    }else{
      personalCodesStatus.res500(res);
    }
  });
}


//get one admin in the data base
function getOneAdmins(req, res){
  adminsModel.findOne({user:req.params.id}, {password:0}, function(err, admins){
    if(!err){
      res
      .status(200)
      .send({
        admins:admins
      });
    }else{
      personalCodesStatus.res500(res);
    }
  });
}

//update one criterion 
function updateOneCriterion(req, res, model){

  console.log('entro');
  var isDefined = helpers.isDefined;
  var condition = {};
  if (isDefined(req.body.name)){    
    if (isDefined(req.body.name.first)) {
      condition.name.first = req.body.name.first;
    }
    if (isDefined(req.body.name.last)) {
      condition.name.last = req.body.name.last;
    }
  }
  if (isDefined(req.body.password)) {
    condition.name = req.body.password;
  }
  res.send({condition:condition});
}

//update admin 
function updateInfoAdmins(req, res){
  // var field = req.query.field.split(',');
  // console.log(field.length);
  console.log(req.params.id);
  adminsModel.findOne({user: req.params.id}, function(err, admin){
    if(!err){
      console.log(admin);
      if(admin){
        console.log('entro 1');
        updateOneCriterion(req, res, admin);
      }else{
        personalCodesStatus.res404(res);
      }
    }else{
      personalCodesStatus.res500(res);
    }
  });
}

module.exports = {
  addAdmin : addAdmin,
  getAllAdmins : getAllAdmins,
  getOneAdmins : getOneAdmins,
  updateInfoAdmins : updateInfoAdmins
};