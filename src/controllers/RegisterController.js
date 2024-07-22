const { createConnection } = require('../config/db');

class RegisterController {
    // Hiển thị trang đăng ký
    index(req, res) {
        res.render('register');
    }

    // Xử lý đăng ký người dùng
    async register(req, res) {
        const name = req.query.fullname;
        const email = req.query.email;
        const password = req.query.password;

        try {
            const connection = await createConnection();
            
            // Kiểm tra xem email đã được sử dụng chưa
            const [rows] = await connection.execute('SELECT * FROM user WHERE email = ?', [email]);
            if (rows.length > 0) {
                console.log('Email đã được sử dụng.');
                res.render('register', { error: 'Email đã được sử dụng.' });
                await connection.end();
                return;
            }
            
            // Thêm người dùng mới vào cơ sở dữ liệu
            const sql = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)';
            const [result] = await connection.execute(sql, [name, email, password]);
            console.log('Người dùng đã được đăng ký thành công!');
            
            await connection.end();
            res.redirect('/login');
        } catch (error) {
            console.error('Lỗi khi đăng ký người dùng:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = new RegisterController();
