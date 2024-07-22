const { createConnection } = require('../config/db');

class CartController {
    // Hiển thị giỏ hàng
    async index(req, res) {
        try {
            const connection = await createConnection();
            
            // Lấy dữ liệu từ bảng "giohang"
            const [cart] = await connection.execute('SELECT * FROM giohang');
            
            res.render('cart', { cart });
            
            await connection.end();
        } catch (error) {
            console.error('Error retrieving cart:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    // Xóa hàng khỏi giỏ hàng
    async deleteCart(req, res) {
        const cartItemId = req.params.id;

        try {
            const connection = await createConnection();
            
            // Câu lệnh SQL để xoá hàng từ bảng "giohang"
            const sql = 'DELETE FROM giohang WHERE id = ?';
            const [result] = await connection.execute(sql, [cartItemId]);
            
            if (result.affectedRows > 0) {
                console.log('Hàng đã được xoá thành công!');
            } else {
                console.log('Không tìm thấy hàng để xoá.');
            }
            
            res.redirect('/cart');
            await connection.end();
        } catch (error) {
            console.error('Lỗi khi xoá hàng:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    // Thêm sản phẩm vào giỏ hàng
    async addCart(req, res) {
        const productId = req.params.product_id;
        console.log(productId);

        try {
            const connection = await createConnection();
            
            // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng của người dùng chưa
            const [existingRows] = await connection.execute('SELECT * FROM giohang WHERE id_user = ? AND id_product = ?', [140, productId]);
            const existingProduct = existingRows[0];
            
            if (existingProduct) {
                // Nếu sản phẩm đã tồn tại, cập nhật số lượng và tổng tiền
                const newQuantity = existingProduct.soluong + 1;
                const totalPrice = existingProduct.gia * newQuantity;

                await connection.execute(
                    'UPDATE giohang SET soluong = ?, thanhtien = ? WHERE id_user = ? AND id_product = ?',
                    [newQuantity, totalPrice, 140, productId]
                );
            } else {
                // Nếu sản phẩm chưa tồn tại, thêm mới vào giỏ hàng
                const [productRows] = await connection.execute('SELECT * FROM sanpham WHERE id = ?', [productId]);
                const product = productRows[0];

                if (!product) {
                    throw new Error('Sản phẩm không tồn tại');
                }

                const totalPrice = product.gia * 1; // Số lượng là 1 khi thêm mới
                await connection.execute(
                    'INSERT INTO giohang (id_product, id_user, ten_sp, hinh, gia, soluong, thanhtien) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [productId, 140, product.ten_sp, product.hinh, product.gia, 1, totalPrice]
                );
            }

            console.log('Sản phẩm đã được thêm vào giỏ hàng');
            res.redirect('/cart');
            await connection.end();
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = new CartController;
