const { createConnection } = require('../config/db');

class LoginController {
    // Hiển thị trang đăng nhập
    index(req, res) {
        res.render('login');
    }

    // Xử lý đăng nhập người dùng
    async login(req, res) {
        const email = req.query.email;
        const password = req.query.password;

        try {
            const connection = await createConnection();
            
            // Tìm người dùng trong cơ sở dữ liệu dựa trên email và password
            const [rows] = await connection.execute('SELECT * FROM user WHERE email = ? AND password = ?', [email, password]);
            
            if (rows.length > 0) {
                console.log('Đăng nhập thành công!');
                console.log('Thông tin người dùng:', rows[0]);
                res.redirect('/');
            } else {
                console.log('Email hoặc mật khẩu không chính xác.');
                res.redirect('/login');
            }
            
            await connection.end();
        } catch (error) {
            console.error('Lỗi khi đăng nhập:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = new LoginController();
