const { createConnection } = require('../config/db');

class SiteController {
    // Hiển thị trang chính
    async index(req, res) {
        res.render('dashboard');
    }

    // Cập nhật đơn hàng
    async updateOrder(req, res) {
        const id = req.query.idOrder;
        const trangthai = req.query.new_status;

        try {
            const connection = await createConnection();
            const sql = 'UPDATE bill SET trangthai = ? WHERE id = ?';
            const [result] = await connection.execute(sql, [trangthai, id]);

            if (result.affectedRows > 0) {
                console.log('Bill đã được cập nhật thành công!');
            } else {
                console.log('Không tìm thấy đơn hàng để cập nhật.');
            }

            res.redirect('/admin/ql_order');
            await connection.end();
        } catch (error) {
            console.error('Lỗi khi cập nhật Bill:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    // Hiển thị chi tiết đơn hàng
    async showOrderDetails(req, res) {
        try {
            const connection = await createConnection();
            const [products] = await connection.execute('SELECT * FROM sanpham');
            const [order] = await connection.execute('SELECT * FROM bill');
            const [orderDetail] = await connection.execute('SELECT * FROM billchitiet');

            const id_detail = parseInt(req.params.id, 10);
            const orderFiltered = orderDetail.filter(item => item.id_bill === id_detail);
            const productsDetail = orderFiltered.map(e => products.find(item => item.id === e.id_product));

            res.render('ql_orderDetail', { order, orderDetail: orderFiltered, productsDetail });
            await connection.end();
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    // Thêm sản phẩm mới
    async addProduct(req, res) {
        const {
            categories: id_catalog,
            product_code: ma_sp,
            name: ten_sp,
            price: gia,
            price_sale: giam_gia,
            img: hinh,
            img1: hinh1 = null,
            img2: hinh2 = null,
            img3: hinh3 = null,
            date: ngay_nhap,
            description: mo_ta = null,
            special: dac_biet = 0,
            view: so_luot_xem = 0
        } = req.query;

        try {
            const connection = await createConnection();
            const sql = `
                INSERT INTO sanpham (id_catalog, ma_sp, ten_sp, gia, giam_gia, hinh, hinh1, hinh2, hinh3, ngay_nhap, mo_ta, dac_biet, so_luot_xem)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [id_catalog, ma_sp, ten_sp, gia, giam_gia || null, hinh, hinh1, hinh2, hinh3, ngay_nhap, mo_ta, dac_biet, so_luot_xem];

            const [result] = await connection.execute(sql, values);

            if (result.affectedRows > 0) {
                console.log('Sản phẩm đã được thêm thành công!');
            } else {
                console.log('Không thể thêm sản phẩm.');
            }

            res.redirect('/admin/ql_product');
            await connection.end();
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    // Xóa sản phẩm
    async deleteProduct(req, res) {
        const id = parseInt(req.params.id, 10);

        try {
            const connection = await createConnection();
            const sql = 'DELETE FROM sanpham WHERE id = ?';
            const [result] = await connection.execute(sql, [id]);

            if (result.affectedRows > 0) {
                console.log('Sản phẩm đã được xóa thành công!');
            } else {
                console.log('Không tìm thấy sản phẩm để xóa.');
            }

            res.redirect('/admin/ql_product');
            await connection.end();
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    // Cập nhật thông tin sản phẩm
    async updateProduct(req, res) {
        const id = parseInt(req.query.idEdit, 10);
        const name = req.query.nameEdit || null;
        const priceMain = req.query.priceMainEdit || null;
        const priceSale = req.query.priceSaleEdit || null;
        const img = req.query.imgEdit || null;
        const description = req.query.descriptionEdit || null;

        try {
            const connection = await createConnection();
            const sql = `
                UPDATE sanpham
                SET ten_sp = ?, gia = ?, giam_gia = ?, hinh = ?, mo_ta = ?
                WHERE id = ?
            `;
            const values = [name, priceMain, priceSale, img, description, id];

            const [result] = await connection.execute(sql, values);

            if (result.affectedRows > 0) {
                console.log('Sản phẩm đã được cập nhật thành công!');
            } else {
                console.log('Không tìm thấy sản phẩm để cập nhật.');
            }

            res.redirect('/admin/ql_product');
            await connection.end();
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    // Lấy thông tin sản phẩm theo ID
    async getProductById(req, res) {
        const productId = req.params.productId;

        try {
            const connection = await createConnection();
            const sql = 'SELECT * FROM sanpham WHERE id = ?';
            const [products] = await connection.execute(sql, [productId]);

            res.render('up_product', { product_edit: products[0] });
            await connection.end();
        } catch (error) {
            console.error('Lỗi khi lấy thông tin sản phẩm:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    // Hiển thị danh sách sản phẩm và danh mục
    async products(req, res) {
        try {
            const connection = await createConnection();
            const [products] = await connection.execute('SELECT * FROM sanpham');
            const [categories] = await connection.execute('SELECT * FROM danhmuc');

            res.render('ql_products', { products, categories });
            await connection.end();
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    // Hiển thị đơn hàng
    async order(req, res) {
        try {
            const connection = await createConnection();
            const [order] = await connection.execute('SELECT * FROM bill');
            const [orderDetail] = await connection.execute('SELECT * FROM billchitiet');

            res.render('ql_order', { order, orderDetail });
            await connection.end();
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    // Hiển thị danh sách người dùng
    async user(req, res) {
        try {
            const connection = await createConnection();
            const [users] = await connection.execute('SELECT * FROM user');

            res.render('ql_user', { user: users });
            await connection.end();
        } catch (error) {
            console.error('Lỗi khi lấy danh sách người dùng:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    // Tìm kiếm (chưa triển khai)
    async search(req, res) {
        res.render('search');
    }
}

module.exports = new SiteController;
