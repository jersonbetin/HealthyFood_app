function res406(res){
  res
  .status(401)
  .send({
    "error":{
      "error": "resourceAlreadyExists",
      "info" : "This error occurs when an client is logged exists"
    }
  });
}

function res404(res){
  res
  .status(404)
  .send({
    "error":{
      "error": "resourceDoesntExists",
      "info" : "This error occurs when an client doesn't exists"
    }
  });
}


function res500(res){
  res
    .status(500)
    .send({
      "error":{
        "error": "somethingIsWrongWithUs",
        "info" : "This error occurs with our server, we expect fix soon"
      }
    });
}

module.exports = {
  res406 : res406,
  res404 : res404,
  res500 : res500
};