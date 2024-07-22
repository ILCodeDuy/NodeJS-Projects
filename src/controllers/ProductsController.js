const { createConnection } = require('../config/db');

class ProductsController {
    // Hiển thị trang danh sách sản phẩm
    async index(req, res) {
        try {
            const connection = await createConnection();
            
            const [products] = await connection.execute('SELECT * FROM sanpham');
            const [categories] = await connection.execute('SELECT * FROM danhmuc');
            
            res.render('products', { products, categories });
            await connection.end();
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    // Hiển thị chi tiết sản phẩm
    async show(req, res) {
        try {
            const connection = await createConnection();
            
            const [products] = await connection.execute('SELECT * FROM sanpham');
            const [categories] = await connection.execute('SELECT * FROM danhmuc');
            
            const productId = parseInt(req.params.id, 10);
            const product = products.find(item => item.id === productId);
            
            if (product) {
                const relatedProducts = products.filter(item => item.id_catalog === product.id_catalog);
                res.render('product-detail', {
                    detail_product: product,
                    relatedProducts,
                    categories
                });
            } else {
                res.status(404).send('Product not found.');
            }
            
            await connection.end();
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    // Hiển thị sản phẩm theo danh mục
    async showProductCategories(req, res) {
        try {
            const connection = await createConnection();
            
            const [products] = await connection.execute('SELECT * FROM sanpham');
            const [categories] = await connection.execute('SELECT * FROM danhmuc');
            
            const categoryId = parseInt(req.params.categories_id, 10);
            const filteredProducts = products.filter(item => item.id_catalog === categoryId);
            
            res.render('products', { products: filteredProducts, categories });
            await connection.end();
        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm theo danh mục:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = new ProductsController();
