var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var client = require('./clients').client

var diseaseSchema = new Schema({
  name: {type:String, required:true},
  description: {type:String, default:''}
});

//client sick(cliente enfermo)
var diseaseClientSchema = new Schema({
  idDisease: {type:Schema.Types.ObjectId, ref: 'disease'},
  idclient: {type:Schema.Types.ObjectId, ref: 'client'}
});

exports.disease = mongoose.model('disease', diseaseSchema);
exports.diseaseClient = mongoose.model('diseaseClient', diseaseClientSchema);
