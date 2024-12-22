const express = require('express');
const {RegisterUser} = require('../Controllers/UserController')
const {LoginUser} = require('../Controllers/UserController')
const {FindUser} = require('../Controllers/UserController')
const {GetUser} = require('../Controllers/UserController')


const router = express.Router();

router.post('/register', RegisterUser);
router.post('/login', LoginUser);
router.get('/find/:UserId', FindUser);
router.get('/', GetUser);

module.exports = router;