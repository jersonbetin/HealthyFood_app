var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restaurantSchema = new Schema({  
  user : {type:String, required : true, unique:true},
  password : {type: String, required: true},  
  email : {type:String, required : true},
  name : {type : String, default : ''},
  phone : {type : String, default: ''},
  address: {type : String, default: ''},
  twitter: {type : String, default: ''},
  facebook: {type : String, default: ''},
  instagram: {type : String, default: ''},
  website: {type : String, default: ''}
});

exports.restaurant = mongoose.model('restaurant', restaurantSchema);