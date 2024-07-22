// const data = require('../data/data')
const mysql = require('mysql2/promise');


class ProductsController{
    index(req,res){
        async function getData() {
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'yame_store'
            });
        
            try {
                const [products, fields] = await connection.execute('SELECT * FROM sanpham');
                const [categories, categoriesFields] = await connection.execute('SELECT * FROM danhmuc');
                const data = {
                    products,
                    categories
                }
                return data; 
            } catch (error) {
                console.error('Error retrieving products:', error);
                throw error; 
            } finally {
                await connection.end();
            }
        }
        
        getData()
            .then(data => {
                res.render('products', {products: data.products, categories: data.categories });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    show(req,res){
        async function getData() {
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'yame_store'
            });
        
            try {
                const [products, fields] = await connection.execute('SELECT * FROM sanpham');
                const [categories, categoriesFields] = await connection.execute('SELECT * FROM danhmuc');
                const data = {
                    products,
                    categories
                }
                return data;
            } catch (error) {
                console.error('Error retrieving products:', error);
                throw error;
            } finally {
                await connection.end();
            }
        }
        getData()
            .then(data => {
                const productId = parseInt(req.params.id);
                const product = data.products.find(item => item.id === productId);
                if (product) {
                    const relatedProducts = data.products.filter(item => item.id_catalog === product.id_catalog);
                    res.render('product-detail', {detail_product: product , relatedProducts: relatedProducts , categories: data.categories});
                } else {
                    res.status(404).send('Sản phẩm không tồn tại.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
       
    }

    showProductCategories(req,res){
        async function getData() {
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'yame_store'
            });
        
            try {
                // Thực hiện truy vấn SQL để lấy tất cả sản phẩm từ bảng sanpham
                const [products, fields] = await connection.execute('SELECT * FROM sanpham');
                const [categories, categoriesFields] = await connection.execute('SELECT * FROM danhmuc');
                const data = {
                    products,
                    categories
                }
                return data; // Trả về kết quả là một mảng chứa tất cả sản phẩm
            } catch (error) {
                console.error('Error retrieving products:', error);
                throw error; // Xử lý lỗi nếu có
            } finally {
                await connection.end();
            }
        }
        getData()
            .then(data => {
                // console.log('All products:', products);
                const categories_id = parseInt(req.params.categories_id);
                const product = data.products.filter(item => item.id_catalog === categories_id);
                res.render('products', {products: product, categories: data.categories });
            })
            .catch(error => {
                console.error('Error:', error);
            });
        
    }
}

module.exports = new ProductsController;