const express = require('express');
const router = express.Router();

const productsController = require('../controllers/ProductsController')

router.use('/pdt-categories/:categories_id',productsController.showProductCategories);
router.use('/product_detail/:id',productsController.show);
router.use('/',productsController.index);

module.exports = router;