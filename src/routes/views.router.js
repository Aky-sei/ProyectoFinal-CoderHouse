import express from 'express'
import { productModel } from '../dao/models/product.model.js'
import { messageModel } from '../dao/models/message.model.js'
import { cartModel } from '../dao/models/cart.model.js'

const router = express.Router()

router.get('/', async (req, res) => {
    res.render('home', {
        products: await productModel.find().lean()
    })
})

router.get('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts', {
        products: await productModel.find().lean()
    })
})

// La logica correspondiente a la ruta '/chat' se deja el 'views' al ser muy simple y no tener una api.
router.get('/chat', async (req,res) => {
    res.render('chat', {
        messages: await messageModel.find().lean()
    })
})

router.get('/products', async (req,res) => {
    let { limit = 2, page = 1, sort, query = "0"} = req.query
    const products = await productModel.paginate(JSON.parse(query), {
        limit: limit,
        page: page,
        sort: sort == "asc" ? 'price code' : sort == "desc" ? '-price code' : {},
        lean: true
    })
    res.render('products', {
        products: products.docs,
        pageData: products,
        prevLink: page > 1 ? `/products?limit=${limit}&page=${parseInt(page) - 1}&sort=${sort || ''}&query=${query}` : null,
        nextLink: page < products.totalPages ? `/products?limit=${limit}&page=${parseInt(page) + 1}&sort=${sort || ''}&query=${query}` : null
    })
})

router.get('/cart/:cid', async (req,res) => {
    const cart = await cartModel.findOne({_id: req.params.cid}).populate('products.product').lean()
    res.render('cart', {
        products: cart.products
    })
})

export {router}