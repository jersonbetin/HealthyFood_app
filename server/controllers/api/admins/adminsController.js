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
      var passSha1 = helpers.encrypt((req.body.pass).toLowerCase());
      adminsModel.create({
        user:(req.body.user).toLowerCase(),
        password: passSha1,
        name: {
          first : (req.body.name.first).toLowerCase(),
          last : (req.body.name.last).toLowerCase()
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
function getOneAdmin(req, res){
  adminsModel.findOne({user:req.params.id}, {password:0}, function(err, admin){
    if(!err){
      res
      .status(200)
      .send({
        admin:admin
      });
    }else{
      personalCodesStatus.res500(res);
    }
  });
}

//update one criterion 
function updateOneCriterion(req, res, model){

  // console.log(req.body.name.first);
  var isDefined = helpers.isDefined;
  var info = {};
  if (isDefined(req.body.name)){    
    if (isDefined(req.body.name.first)) {
     model.name.first= req.body.name.first;
    }
    if (isDefined(req.body.name.last)) {
      model.name.last= req.body.name.last;
    }
  }
  if (isDefined(req.body.pass)) {
    var passSha1 = helpers.encrypt(req.body.pass);
    model.password = passSha1;
  }
  model.save(function(err, admin){
    if(!err){
      res
        .status(200)
        .send({admin : admin});
    }else{
      personalCodesStatus.res500(res);
    }
  });
}

//update admin 
function updateInfoAdmin(req, res){
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

//delete admin
function deleteAdmin(req, res){
  adminsModel.findOne({user:req.params.id}, function(err, admin){
    console.log(err);
    if(!err){
      if(admin){
        admin.remove(function(err){
          if(!err){            
            res
            .status(200)
            .send({
              "message":"the admin was removed"
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

module.exports = {
  addAdmin : addAdmin,
  getAllAdmins : getAllAdmins,
  getOneAdmin : getOneAdmin,
  updateInfoAdmin : updateInfoAdmin,
  deleteAdmin : deleteAdmin
};