const express = require('express');
const router = express.Router();

const ad_SiteController = require('../controllers/ad_SiteController')




router.get('/updateOrder',ad_SiteController.updateOrder);
router.get('/addProduct',ad_SiteController.addProduct);
router.use('/ql_product/:id',ad_SiteController.deleteProduct);
router.get('/updateProduct',ad_SiteController.updateProduct);
router.get('/up_product/:productId',ad_SiteController.getProductById);
router.use('/ql_user',ad_SiteController.user);
router.use('/admin/ql_order/:id',ad_SiteController.showOrderDetails);
router.use('/ql_order',ad_SiteController.order);
router.use('/ql_product',ad_SiteController.products);
router.use('/',ad_SiteController.index);

module.exports = router;