const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const AdminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')

// Middlewares

const guest = require('../app/http/middleware/guest')
const auth = require('../app/http/middleware/auth')
const admin = require('../app/http/middleware/admin')

function initRoutes(app){ 

    app.get('/', homeController().index)
    
    app.get('/cart', cartController().cart)
    app.post('/update-cart',cartController().update)
    
    app.get('/login', guest,authController().login)
    app.post('/login', authController().postLogin)
    
    app.get('/register',guest,authController().register)
    app.post('/register', authController().postRegister)

    app.post('/logout', authController().logout)


    // customer routes

    app.post('/orders', orderController().store)
    app.get('/customers/orders',auth,orderController().index)
    app.get('/customers/orders/:id',auth,orderController().show)


    // Admin routes

    app.get('/admin/orders',admin,AdminOrderController().index)
    app.post('/admin/orders/status',admin,statusController().update)
    
    

    
}
module.exports = initRoutes