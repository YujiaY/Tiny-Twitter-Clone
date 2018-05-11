const router = require('express').Router();

// If user hits this route, then he will be served
router.get('/', (req, res, next) => {
    res.render('main/landing');
})

module.exports = router;