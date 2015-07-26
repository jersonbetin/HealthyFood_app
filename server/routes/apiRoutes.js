"use strict";

// var usersController = require("../controllers/api/usersController");
var adminsController = require("../controllers/api/admins/adminsController");
var middleware = require("../middlewares/middleware");

module.exports = function apiRoutes(app) {
  app.all('*', function(req, res, next){
      console.log('always passes for here', req.body, req.method);
      next();
  });

  //path about admins
  app.route("/api/admins")
    .get(middleware.checkToken, adminsController.getAllAdmins)
    .post(adminsController.addAdmin);
  app.route("/api/admins/:id")
    .get(middleware.checkToken, adminsController.getOneAdmins)
    .put(middleware.checkToken, adminsController.updateInfoAdmins); 

  app.post('/', function(req, res){
    console.log(req.body.user);
    var service = require("../controllers/helpers/service").createToken;
    res.status(200).send({token:service(req.body.user)});
  });


  //config: when don't exist the path
  app.use(function(req, res, next){
    res
      .status(404)
      .send({
        "error":{
          "error" : "RequestNotFound",
          "message" : "the path don´t exists, try another"

        }
      })
  });
}