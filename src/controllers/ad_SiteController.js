const mysql = require('mysql2/promise');
class SiteController{
    //home
    index(req,res){
        res.render('dashboard');
    }

    updateOrder(req,res){
            const id = req.query.idOrder;
            const trangthai = req.query.new_status;
            async function updateOrder(id,trangthai) {
                const connection = await mysql.createConnection({
                        host: 'localhost',
                        user: 'root',
                        password: '',
                        database: 'yame_store'
                    });
                    const sql = `
                                UPDATE bill 
                                SET trangthai = ?
                                WHERE id = ?
                                `;
    
                                const values = [trangthai, id];
                try {
                    
                    // Thực thi câu lệnh SQL
                    const [rows, fields] = await connection.execute(sql, values);
                    // Kiểm tra xem có bao nhiêu dòng đã được ảnh hưởng
                    if (rows.affectedRows > 0) {
                        console.log('Bill đã được cập nhật thành công!');
                    } else {
                        console.log('Không tìm thấy sản phẩm để cập nhật.');
                    }
            
                    // Đóng kết nối
                    await connection.end();
                } catch (error) {
                    console.error('Lỗi khi cập nhật Bill:', error);
                }
            }
                updateOrder(id,trangthai);
                res.redirect('/admin/ql_order');
    }

    showOrderDetails(req,res){
        async function getData() {
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'yame_store'
            });
        
            try {
                const [products, fields] = await connection.execute('SELECT * FROM sanpham');
                const [order, orderfields] = await connection.execute('SELECT * FROM bill');
                const [orderDetail, orderDetailfields] = await connection.execute('SELECT * FROM billchitiet');
                const data = {
                    order,
                    orderDetail,
                    products
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
                const id_detail = parseInt(req.params.id);
                const order = data.orderDetail.filter(item => item.id_bill === id_detail);
                const products = [];
                order.forEach(e => {
                    const product = data.products.filter(item => item.id === e.id_product);
                    products.push(...product);
                });
                res.render('ql_orderDetail', {order: data.order, orderDetail: order, productsDetail: products});
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    addProduct(req,res){
        console.log(req.query);
        const  id_catalog = req.query.categories;
        const  ma_sp = req.query.product_code;
        const  ten_sp = req.query.name;
        const  gia = req.query.price;
        const  giam_gia = req.query.price_sale;
        const  hinh = req.query.img;
        const  hinh1= req.query.img1 || null;
        const  hinh2 = req.query.img2 || null;
        const  hinh3 = req.query.img3 || null;
        const  ngay_nhap = req.query.date;
        const  mo_ta = req.query.description || null;
        const  dac_biet = req.query.special || 0;
        const  so_luot_xem = req.query.view || 0;
        const product = {
            id_catalog,
            ma_sp,
            ten_sp,
            gia,
            giam_gia,
            hinh,
            hinh1,
            hinh2,
            hinh3,
            ngay_nhap,
            mo_ta,
            dac_biet,
            so_luot_xem
        };
        async function addProduct(product) {
            try {
                // Tạo kết nối đến cơ sở dữ liệu
                const connection = await mysql.createConnection({
                    host: 'localhost',
                    user: 'root',
                    password: '',
                    database: 'yame_store'
                });
        
                // Câu lệnh SQL để thêm sản phẩm
                const sql = `
                    INSERT INTO sanpham (id_catalog, ma_sp, ten_sp, gia, giam_gia, hinh, hinh1, hinh2, hinh3, ngay_nhap, mo_ta, dac_biet, so_luot_xem)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
        
                // Thực thi câu lệnh SQL với thông tin sản phẩm
                const values = [
                    product.id_catalog,
                    product.ma_sp,
                    product.ten_sp,
                    product.gia,
                    product.giam_gia || null,
                    product.hinh,
                    product.hinh1 || null,
                    product.hinh2 || null,
                    product.hinh3 || null,
                    product.ngay_nhap,
                    product.mo_ta || null,
                    product.dac_biet || 0,
                    product.so_luot_xem || 0
                ];
        
                const [rows, fields] = await connection.execute(sql, values);
        
                // Kiểm tra xem có bao nhiêu dòng đã được thêm
                if (rows.affectedRows > 0) {
                    console.log('Sản phẩm đã được thêm thành công!');
                } else {
                    console.log('Không thể thêm sản phẩm.');
                }
        
                // Đóng kết nối
                await connection.end();
            } catch (error) {
                console.error('Lỗi khi thêm sản phẩm:', error);
            }
        }
        
        // Sử dụng hàm để thêm sản phẩm
        addProduct(product);
        res.redirect('/admin/ql_product');
    }

    deleteProduct(req, res){
        const id = parseInt(req.params.id);
        async function deleteProduct(id) {
            try {
                // Tạo kết nối đến cơ sở dữ liệu
                const connection = await mysql.createConnection({
                    host: 'localhost',
                    user: 'root',
                    password: '',
                    database: 'yame_store'
                });
                // Câu lệnh SQL để xóa sản phẩm với ID cụ thể
                const sql = 'DELETE FROM sanpham WHERE id = ?';
        
                // Thực thi câu lệnh SQL với thông tin sản phẩm cần xóa
                const [rows, fields] = await connection.execute(sql, [id]);
        
                // Kiểm tra xem có bao nhiêu dòng đã bị ảnh hưởng (xóa)
                if (rows.affectedRows > 0) {
                    console.log('Sản phẩm đã được xóa thành công!');
                } else {
                    console.log('Không tìm thấy sản phẩm để xóa.');
                }
        
                // Đóng kết nối
                await connection.end();
            } catch (error) {
                console.error('Lỗi khi xóa sản phẩm:', error);
            }
        }
        // Gọi hàm để xóa sản phẩm với ID cụ thể
        deleteProduct(id);
        res.redirect('/admin/ql_product');
    }

    updateProduct(req,res){
        const id = parseInt(req.query.idEdit);
        const name = req.query.nameEdit || null;
        const priceMain = req.query.priceMainEdit || null;
        const priceSale = req.query.priceSaleEdit || null;
        const img = req.query.imgEdit || null;
        const description = req.query.descriptionEdit || null;
        async function updateProduct(id, name, priceMain, priceSale, img, description) {
            const connection = await mysql.createConnection({
                    host: 'localhost',
                    user: 'root',
                    password: '',
                    database: 'yame_store'
                });
                const sql = `
                            UPDATE sanpham 
                            SET ten_sp = ?, gia = ?, giam_gia = ?, hinh = ?, mo_ta = ?
                            WHERE id = ?
                            `;

                            const values = [name, priceMain, priceSale, img, description, id];
            try {
                
                // Thực thi câu lệnh SQL
                const [rows, fields] = await connection.execute(sql, values);
                // Kiểm tra xem có bao nhiêu dòng đã được ảnh hưởng
                if (rows.affectedRows > 0) {
                    console.log('Sản phẩm đã được cập nhật thành công!');
                } else {
                    console.log('Không tìm thấy sản phẩm để cập nhật.');
                }
        
                // Đóng kết nối
                await connection.end();
            } catch (error) {
                console.error('Lỗi khi cập nhật sản phẩm:', error);
            }
        }
            updateProduct(id,name, priceMain, priceSale, img, description);
            res.redirect('/admin/ql_product');
    }

    async getProductById(req, res) {
        const productId = req.params.productId; // controller lay ra
        console.log("productId",productId);
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'yame_store'
        });  // đây để kết nối DB
        const sql = `SELECT * FROM sanpham WHERE id = ${productId}`
        try {
            const [products, fields] = await connection.execute(sql)
            // console.log('data theo id', products[0])
            res.render('up_product', {product_edit: products[0]});
        } catch (err) {
            console.log(err);
        } finally {
            await connection.close();
        }
    }

    products(req,res){
        async function getData() {
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'yame_store'
            });
        
            try {
                const [products, fields] = await connection.execute('SELECT * FROM sanpham');
                const [categories, categoriesfields] = await connection.execute('SELECT * FROM danhmuc');
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
                res.render('ql_products', {products: data.products , categories: data.categories});
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    order(req,res){
        
        async function getData() {
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'yame_store'
            });
        
            try {
                const [order, orderfields] = await connection.execute('SELECT * FROM bill');
                const [oderDetail, oderDetailfields] = await connection.execute('SELECT * FROM billchitiet');
                const data = {
                    order,
                    oderDetail
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
                res.render('ql_order', {order: data.order, oderDetail: data.oderDetail});
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    user(req,res){
        async function getData() {
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'yame_store'
            });
        
            try {
                const [user, fields] = await connection.execute('SELECT * FROM user');
                const data = {
                    user
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
                res.render('ql_user', {user: data.user});
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    //search
    search(req,res){
    }
}

module.exports = new SiteController;

