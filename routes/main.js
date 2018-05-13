const router = require('express').Router();
const User = require('../models/user');

// If user hits this route, then he will be served
router.get('/', (req, res, next) => {
    res.render('main/landing');
    // res.json('donkey');
});

router.get('/create-new-user', (req, res, next) => {
    var user = new User;
    user.email = "testemail@gmail.com";
    user.name = "John Doe";
    user.password = "Hello";
    user.save(function(err) {
        if(err) return next(err);
        res.json("Successfully created");
    });
});

module.exports = router;