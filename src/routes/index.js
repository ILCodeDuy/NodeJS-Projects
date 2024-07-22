const newsRouter = require('./news')
const productsRouter = require('./products')
const siteRouter = require('./site')
const cartRouter = require('./cart')
const adminRouter = require('./admin')
const registerRouter = require('./register')
const loginRouter = require('./login')
function route(app){
    app.use('/login',loginRouter);
    app.use('/register',registerRouter);
    app.use('/admin',adminRouter);
    app.use('/cart', cartRouter);
    app.use('/products',productsRouter);
    app.use('/news',newsRouter);
    app.use('/',siteRouter);
}

module.exports = route;