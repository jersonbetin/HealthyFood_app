"use strict";
var mongoose = require('mongoose');
var clientsModel = require('../../../models/clients').client;
var helpers = require('../../helpers/helpers');
var validateStructure = require('./clientsValidation');
var personalCodesStatus = require('./personalCodeclient');

//add new client
function addClient(req, res){
  // console.log("add ",req.body);
  var validate = validateStructure.validateClients;
  validate(req.body, function(testAuthorized, data){
    console.log("entro aqui");
    if(testAuthorized){
      var passSha1 = helpers.encrypt(req.body.pass);
      clientsModel.create({
        email:req.body.email,
        password: passSha1,
        name: {
          first : req.body.name.first,
          last : req.body.name.last
        },
        phone : req.body.phone,
        address : req.body.address
      },function(err, client){
          if(!err){
            var clientCreate = {
              "email" : client.email,
              "name" : {
                "first" : client.name.first,
                "last" : client.name.last
              },
              "phone" : client.phone,
              "address" : client.address
            };
            res
              .status(201)
              .send({clientCreate:clientCreate});
          }else{
            if(err.code == 11000){
              personalCodesStatus.res406(res);
            }else{
              personalCodesStatus.res500(res);
            }
          }
      });
    }else{
      validateStructure.resToIncorrectStructure(req, res, data);
    }
  });
}

//get client by criteria
function searchClients(req, res){
  console.log(req.query);

  if(req.query.first && req.query.last){
    var query={
      "name.first":{ $regex: req.query.first},
      "name.last":{ $regex: req.query.last}
    };
  }else{
    if(req.query.first){
      var query={"name.first":{ $regex: req.query.first} };
    }
    if(req.query.last){
      var query={"name.last":{ $regex: req.query.last}};
    }
    if(req.query.email){
      var query={"email":{ $regex: req.query.email}};
    }
  }
  console.log(query);

  clientsModel.find(query, {password:0}).sort("name").exec(function(err, clients){
    if(!err){
      res
      .status(200)
      .send({
        clients : clients
      });
    }else{
      personalCodesStatus.res500(res);
    }
  });
}
//get one client in the data base
function getOneClient(req, res){
  clientsModel.findOne({email:req.params.id}, {password:0}, function(err, client){
    if(!err){
      res
      .status(200)
      .send({
        client : client
      });
    }else{
      personalCodesStatus.res500(res);
    }
  });
}


//update one criterion
function updateOneCriterion(req, res, model){
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
  if (isDefined(req.body.phone)) {
    model.phone = req.body.phone;
  }

  if (isDefined(req.body.address)) {
    model.address = req.body.address;
  }
  if (isDefined(req.body.pass)) {
    var passSha1 = helpers.encrypt(req.body.pass);
    model.password = passSha1;
  }
  model.save(function(err, client){
    if(!err){
      res
        .status(200)
        .send({client : client});
    }else{
      personalCodesStatus.res500(res);
    }
  });
}

function updateInfoClient(req, res){
  console.log(req.params.id);
  clientsModel.findOne({email: req.params.id}, function(err, client){
    if(!err){
      console.log(client);
      if(client){
        console.log('entro 1');
        updateOneCriterion(req, res, client);
      }else{
        personalCodesStatus.res404(res);
      }
    }else{
      personalCodesStatus.res500(res);
    }
  });
}

//delete client
function deleteClient(req, res){
  clientsModel.findOne({email:req.params.id}, function(err, client){
    console.log(err);
    if(!err){
      if(client){
        client.remove(function(err){
          if(!err){
            res
            .status(200)
            .send({
              "message":"the client was removed"
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
 searchClients : searchClients,
 addClient : addClient,
 getOneClient : getOneClient,
 updateInfoClient : updateInfoClient,
 deleteClient : deleteClient
}
