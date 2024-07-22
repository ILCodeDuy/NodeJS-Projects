const express = require('express');
const router = express.Router();

const CartController = require('../controllers/CartController')


router.use('/deleteCart/:id',CartController.deleteCart);
router.use('/addCart/:product_id',CartController.addCart);
router.use('/',CartController.index);

module.exports = router;