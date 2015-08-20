var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var restaurant = require('./restaurant').restaurant; 
var client = require('./clients').client; 
var ingredient = require('./ingredient').ingredient;

var plateSchema = new Schema({
  nit : {type : String, required : true, unique:true},
  name : {type : String, default : ''}
});

var menuSchema = new Schema({
  idRestaurant: {type:Schema.Types.ObjectId, ref: 'restaurant'},
  idplate: {type:Schema.Types.ObjectId, ref: 'plate'}
});

var favoritePlateSchema = new Schema({
  idClient: {type:Schema.Types.ObjectId, ref: 'client'},
  idplate: {type:Schema.Types.ObjectId, ref: 'plate'}
});

var plateIngredientSchema = new Schema({
  idIngredient: {type:Schema.Types.ObjectId, ref: 'ingredient'},
  idPlate : {type:Schema.Types.ObjectId, ref: 'plate'}
});

exports.plate = mongoose.model('plate', plateSchema);
exports.menu = mongoose.model('menu', menuSchema);
exports.plateIngredient = mongoose.model('plateIngredient', plateIngredientSchema);
exports.favoritePlate = mongoose.model('favoritePlate', menuSchema);