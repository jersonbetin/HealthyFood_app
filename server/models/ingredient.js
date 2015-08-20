var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var disease = require('./diseases').disease

var ingredientSchema = new Schema({
  name: {type:String, required:true, unique:true},
  description: {type:String, default:''}
});

//ingrediente enfermedad
var deseaseIngredientSchema = new Schema({
  isRecommended:{type:Boolean, default:false},
  idDisease: {type:Schema.Types.ObjectId, ref: 'disease'},
  idIngredient: {type:Schema.Types.ObjectId, ref: 'ingredient'}
});


exports.ingredient = mongoose.model('ingredient', ingredientSchema);
exports.deseaseIngredient = mongoose.model('deseaseIngredient', deseaseIngredientSchema);