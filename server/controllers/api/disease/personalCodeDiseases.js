function res404(res){
  res
  .status(404)
  .send({
    "error":{
      "error": "resourceDoesntExists",
      "info" : "This error occurs when an disease doesn't exists"
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
  res404 : res404,
  res500 : res500
};