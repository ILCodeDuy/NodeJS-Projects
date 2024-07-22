const newsRouter = require('./newsRoutes')
const productsRouter = require('./productsRoutes')
const siteRouter = require('./siteRoutes')
const cartRouter = require('./cartRoutes')
const adminRouter = require('./adminRoutes')
const registerRouter = require('./registerRoutes')
const loginRouter = require('./loginRoutes')
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