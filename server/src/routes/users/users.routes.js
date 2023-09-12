const express = require("express");
const usersController = require("./users.controller");
const usersRouter = express.Router();

usersRouter.get("/", usersController.getAllUsers);
usersRouter.post("/", usersController.createUser);
usersRouter.put("/:id", usersController.updateUser);
usersRouter.delete("/:id", usersController.deleteUser);


module.exports = usersRouter;