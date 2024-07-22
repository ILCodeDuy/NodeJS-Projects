const mysql = require('mysql2/promise');
class CartController{
    index(req,res){
        async function getData() {
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'yame_store'
            });
        
            try {
                const [cart, cartFields] = await connection.execute('SELECT * FROM giohang');
                const data = {
                    cart
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
                res.render('cart',{cart: data.cart})
            })
            .catch(error => {
                console.error('Error:', error);
            });
        
    }

    deleteCart(req, res) {
        const cartItemId = req.params.id;
        async function deleteCartItemById(cartItemId) {
            try {
                // Tạo kết nối đến cơ sở dữ liệu
                const connection = await mysql.createConnection({
                    host: 'localhost',
                    user: 'root',
                    password: '',
                    database: 'yame_store'
                });
        
                // Câu lệnh SQL để xoá hàng từ bảng "giohang" theo id
                const sql = 'DELETE FROM giohang WHERE id = ?';
        
                // Thực thi câu lệnh SQL với id được truyền vào
                const [rows, fields] = await connection.execute(sql, [cartItemId]);
        
                // Kiểm tra xem có bao nhiêu hàng đã được xoá
                if (rows.affectedRows > 0) {
                    console.log('Hàng đã được xoá thành công!');
                } else {
                    console.log('Không tìm thấy hàng để xoá.');
                }
        
                // Đóng kết nối
                await connection.end();
            } catch (error) {
                console.error('Lỗi khi xoá hàng:', error);
            }
        }
        deleteCartItemById(cartItemId);
        res.redirect('/cart');
    }

    addCart(req,res){
        const productID = req.params.product_id;
        console.log(productID);
        async function addToCart(productId, quantity) {
            try {
                // Tạo kết nối đến cơ sở dữ liệu
                    const connection = await mysql.createConnection({
                        host: 'localhost',
                        user: 'root',
                        password: '',
                        database: 'yame_store'
                    });

                    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng của người dùng (id_user) chưa
                    const [existingRows] = await connection.execute('SELECT * FROM giohang WHERE id_user = ? AND id_product = ?', [140, productId]);
                    const existingProduct = existingRows[0];

                    if (existingProduct) {
                        // Nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng sản phẩm
                        quantity += existingProduct.soluong;
                        const totalPrice = existingProduct.gia * quantity;

                        // Cập nhật số lượng và tổng tiền cho sản phẩm trong giỏ hàng
                        await connection.execute(
                            'UPDATE giohang SET soluong = ?, thanhtien = ? WHERE id_user = ? AND id_product = ?',
                            [quantity, totalPrice, 140, productId]
                        );
                    } else {
                        // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm mới vào giỏ hàng
                        const [productRows] = await connection.execute('SELECT * FROM sanpham WHERE id = ?', [productId]);
                        const product = productRows[0];

                        if (!product) {
                            throw new Error('Sản phẩm không tồn tại');
                        }
                        const totalPrice = product.gia * quantity;
                        await connection.execute(
                            'INSERT INTO giohang (id_product, id_user, ten_sp, hinh, gia, soluong, thanhtien) VALUES (?, ?, ?, ?, ?, ?, ?)',
                            [productId, 140, product.ten_sp, product.hinh, product.gia, quantity, totalPrice]
                        );
                    }
                    console.log('Sản phẩm đã được thêm vào giỏ hàng');
                    await connection.end();
                } catch (error) {
                    console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
                }
        }
        addToCart(productID, 1);
        res.redirect('/cart');
    }
}

module.exports = new CartController;