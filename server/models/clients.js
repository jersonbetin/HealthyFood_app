var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clientSchema = new Schema({  
  email : {type:String, required : true, unique:true},
  password : {type: String, required: true},
  name : {
    first : {type : String, default : ''},
    last : {type : String, default : ''}
  },
  phone : {type : String, default: ''},
  address: {type : String, default: ''}
});

exports.client = mongoose.model('client', clientSchema);