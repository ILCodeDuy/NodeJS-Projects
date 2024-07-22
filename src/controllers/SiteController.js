const { createConnection } = require('../config/db');

class SiteController {
    // Home
    async index(req, res) {
        try {
            const connection = await createConnection();
            const [rows] = await connection.execute('SELECT * FROM sanpham');
            res.render('home', { products: rows });
            await connection.end();
        } catch (error) {
            console.error('Error retrieving products:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    // Search
    async search(req, res) {
        const kyw = req.query.kyw;
        try {
            const connection = await createConnection();
            const [categories] = await connection.execute('SELECT * FROM danhmuc');
            const [rows] = await connection.execute('SELECT * FROM sanpham WHERE ten_sp LIKE ?', [`%${kyw}%`]);

            if (rows.length > 0) {
                res.render('products', { products: rows, categories: categories });
            } else {
                res.render('products', { products: [], categories: categories });
            }

            await connection.end();
        } catch (error) {
            console.error('Error searching for products:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = new SiteController;
