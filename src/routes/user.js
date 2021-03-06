const express = require('express')
const Route = express.Router()

const Auth = require('../middleware/auth')
const UserController = require('../controllers/user')

Route
    .get('/', Auth.verifyTokenMiddleware, UserController.getAllUsers)
    .get('/profile', Auth.verifyTokenMiddleware, UserController.getUserProfile)
    .get('/:id', Auth.verifyTokenMiddleware, UserController.getOneUser)
    .post('/register/admin', Auth.verifyTokenMiddleware, Auth.verifyAdminPrevilege, UserController.registerAdmin)
    .post('/register', UserController.registerUser)
    .post('/login', UserController.login)

module.exports = Route