const router = require('express').Router();
const controller = require('../controllers/contact.controller');
const { validateContact } = require('../middleware/validate');

router.post('/', validateContact, controller.create);

module.exports = router;
