"use strict"
var mongoose = require('mongoose');
var restaurantModel = require('../../../models/restaurant').restaurant;
var helpers = require('../../helpers/helpers');
var validateStructure = require('./restaurantsValidation');
var personalCodesStatus = require('./personalCodeclient');

//add new restaurant
function addRestaurant(req, res){
  console.log("add", req.body);
  var validate = validateStructure.validateRestuarants;
  validate(req.body, function(textAuthorized, data){
    if(textAuthorized){
      var passSha1 = helpers.encrypt(req.body.pass);
      restaurantModel.create({
        user : req.body.user,
        password : passSha1,
        email : req.body.email,
        name : req.body.name,
        phone : req.body.phone,
        address: req.body.address,
        twitter: req.body.twitter,
        facebook: req.body.facebook,
        instagram: req.body.instagram,
        website: req.body.website
      }, function(err, restaurant){
        if(!err){
          var restaurantCreate = {
            "user" : restaurant.user,
            "email" : restaurant.email,
            "name" : restaurant.name,
            "phone" : restaurant.phone,
            "address": restaurant.address,
            "twitter": restaurant.twitter,
            "facebook": restaurant.facebook,
            "instagram": restaurant.instagram,
            "website": restaurant.website
          };
          res
           .status(201)
           .send({restaurantCreate:restaurantCreate});
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

//get all Restaurants in the data base
function searchRestaurants(req, res){
  var query ={};

  if(req.query.first){
    query .name .first=req.query.first;
  }

  if(req.query.last){
    query .name .last=req.query.last;
  }

  restaurantModel.find(query, {password:0}).sort("name").exec(function(err, restaurants){
    if(!err){
      res
      .status(200)
      .send({
        restaurants : restaurants
      });
    }else{
      personalCodesStatus.res500(res);
    }
  });
}

//get one Restaurant in the data base
function getOneRestaurant(req, res){
  restaurantModel.findOne({user:req.params.id}, {password:0}, function(err, restaurant){
    if(!err){
      res
      .status(200)
      .send({
        restaurant : restaurant
      });
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
  if (isDefined(req.body.email)){
    model.email = req.body.email;
  }
  if (isDefined(req.body.facebook)) {
    model.facebook = req.body.facebook;
  }
  if (isDefined(req.body.twitter)) {
    model.twitter = req.body.twitter;
  }
  if (isDefined(req.body.instagram)) {
    model.instagram = req.body.instagram;
  }
  if (isDefined(req.body.website)) {
    model.website = req.body.website;
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
  model.save(function(err, restautant){
    if(!err){
      res
        .status(200)
        .send({restautant : restautant});
    }else{
      personalCodesStatus.res500(res);
    }
  });
}

function updateInfoRestaurant(req, res){
  console.log(req.params.id);
  restaurantModel.findOne({user: req.params.id}, function(err, restaurant){
    if(!err){
      console.log(restaurant);
      if(restaurant){
        updateOneCriterion(req, res, restaurant);
      }else{
        personalCodesStatus.res404(res);
      }
    }else{
      personalCodesStatus.res500(res);
    }
  });
}

//delete restaurant
function deleteRestaurant(req, res){
  debugger;
  restaurantModel.findOne({user:req.params.id}, function(err, restaurant){
    console.log(err);
    if(!err){
      if(restaurant){
        restaurant.remove(function(err){
          if(!err){
            res
            .status(200)
            .send({
              "message":"the restaurant was removed"
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
  addRestaurant : addRestaurant,
  searchRestaurants : searchRestaurants,
  getOneRestaurant : getOneRestaurant,
  updateInfoRestaurant : updateInfoRestaurant,
  deleteRestaurant : deleteRestaurant
}
