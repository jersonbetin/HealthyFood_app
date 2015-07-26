var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminSchema = new Schema({
  user : {type : String, required : true, unique:true},
  password : {type: String, required: true},
  name : {
    first : {type : String, default : ''},
    last : {type : String, default : ''}
  }
});

exports.admin = mongoose.model('admin', adminSchema);