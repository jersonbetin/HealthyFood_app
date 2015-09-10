"use strict";

// var usersController = require("../controllers/api/usersController");
var adminController = require("../controllers/api/admins/adminsController");
var clientController = require("../controllers/api/clients/clientsController");
var restaurantController = require("../controllers/api/restaurants/restaurantsController");
var ingredientController = require("../controllers/api/ingredients/ingredientController");
var middleware = require("../middlewares/middleware");

module.exports = function apiRoutes(app) {
  app.all('*', function(req, res, next){
      console.log('always passes for here', req.body, req.method);
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      console.log(req.hostname+req.originalUrl);
      next();
  });

  //path about admin
  app.route("/api/admin")
    .get(middleware.checkToken, adminController.getAllAdmins)//
    .post(adminController.addAdmin);
  app.route("/api/admin/:id")
    .get(middleware.checkToken, adminController.getOneAdmin)
    .put(middleware.checkToken, adminController.updateInfoAdmin) 
    .delete(middleware.checkToken, adminController.deleteAdmin); 

  //path about clientes
  app.route("/api/client")
    .get(middleware.checkToken, clientController.getAllClients)
    .post(clientController.addClient);
  app.route("/api/client/:id")
    .get(middleware.checkToken, clientController.getOneClient)
    .put(middleware.checkToken, clientController.updateInfoClient)
    .delete(middleware.checkToken, clientController.deleteClient);

  //path about restaurant
  app.route("/api/restaurant")
    .get(middleware.checkToken, restaurantController.getRestaurants)
    .post(restaurantController.addRestaurant);
  app.route("/api/restaurant/:id")
    .get(middleware.checkToken, restaurantController.getOneRestaurant)
    .put(middleware.checkToken, restaurantController.updateInfoRestaurant)
    .delete(middleware.checkToken, restaurantController.deleteRestaurant);

  //path about ingredient
  app.route("/api/ingredient")
    .get(middleware.checkToken,ingredientController.getIngredients)
    .post(middleware.checkToken,ingredientController.addIngredient);
  app.route("/api/ingredient/:id")
    .get(middleware.checkToken, ingredientController.getOneIngredient)
    .put(middleware.checkToken, ingredientController.updateInfoIngredient)
    .delete(middleware.checkToken, ingredientController.deleteIngredient);
  
  //authenticated login
  app.route('/api/auth')
    .post(middleware.auth);


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