const router = require('express').Router();
const controller = require('../controllers/categories.controller');

router.get('/', controller.list);

module.exports = router;
