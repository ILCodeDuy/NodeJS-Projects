const mysql = require('mysql2/promise');
class LoginController{
    index(req,res){
        res.render('login')
    }

    login(req,res){
        const email = req.query.email;
        const password = req.query.password;
        async function loginUser(email, password) {
            try {
                // Tạo kết nối đến cơ sở dữ liệu
                const connection = await mysql.createConnection({
                    host: 'localhost',
                    user: 'root',
                    password: '',
                    database: 'yame_store'
                });
        
                // Tìm người dùng trong cơ sở dữ liệu dựa trên email và password
                const [rows, fields] = await connection.execute('SELECT * FROM user WHERE email = ? AND password = ?', [email, password]);
        
                if (rows.length > 0) {
                    console.log('Đăng nhập thành công!');
                    res.redirect('/');
                    console.log('Thông tin người dùng:', rows[0]);
                } else {
                    console.log('Email hoặc mật khẩu không chính xác.');
                    res.redirect('/login');
                }
        
                // Đóng kết nối
                await connection.end();
            } catch (error) {
                console.error('Lỗi khi đăng nhập:', error);
            }
        }
        loginUser(email, password);
    }
}

module.exports = new LoginController;