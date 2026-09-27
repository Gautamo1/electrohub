const router = require('express').Router();
const controller = require('../controllers/devices.controller');

// Order matters: static segments before /:id
router.get('/brands', controller.brands);
router.get('/category/:category', controller.byCategory);
router.get('/:id', controller.byId);
router.get('/', controller.list);

module.exports = router;
