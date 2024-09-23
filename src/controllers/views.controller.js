import usersService from '../dao/services/users.service.js'
import productsService from '../dao/services/products.service.js'
import cartsService from '../dao/services/carts.service.js'
import messagesService from '../dao/services/message.service.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

import {faker} from '@faker-js/faker'

async function renderHome(req,res) {
    if(req.user) {
        res.render('home', {
            isLoged: true
        })
    } else {
        res.render('home', {
            isLoged: false
        })
    }
}

async function renderChat(req,res) {
    const user = await usersService.getUserById(req.user.id)
    const name = user.fullName.split(" ")[0]
    res.render('chat', {
        messages: await messagesService.getAllMessages(),
        user: name
    })
}

async function renderProducts(req,res) {
    let { limit = 3, page = 1, sort, query = "0"} = req.query
    let user = false
    if (req.user) {
        user = await usersService.getUserById(req.user.id)
    }
    const products = await productsService.getPaginatedProducts(req.query)
    res.render('products', {
        isLoged: user ? true : false,
        isAdmin: user ? user.role === "ADMIN"||"PREMIUM" ? true : false : false,
        user: user,
        products: products.docs,
        pageData: products,
        prevLink: page > 1 ? `/products?limit=${limit}&page=${page>products.totalPages+1 ? parseInt(products.totalPages) : parseInt(page) - 1}&sort=${sort || ''}&query=${query}` : null,
        nextLink: page < products.totalPages ? `/products?limit=${limit}&page=${parseInt(page) + 1}&sort=${sort || ''}&query=${query}` : null,
        mock: {
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            code: faker.string.numeric({length:5}),
            price: faker.number.int({min:10,max:1000}),
            status: "true",
            stock: faker.number.int({min:10,max:100}),
            category: faker.commerce.productAdjective()
        }
    })
}

async function redirectToCart(req,res) {
    const user = await usersService.getUserById(req.user.id)
    res.redirect(`/cart/${user.cart}`)
}

async function renderCartFromParamsId(req,res) {
    const cart = await cartsService.getPopulatedCartById(req.params.cid)
    res.render('cart', {
        products: cart.products,
        cartID: req.params.cid
    })
}

async function renderLogin(req,res) {
    if(req.user) {
        res.redirect('/profile')
    } else {
        res.render('login')
    }
}

async function renderRegister(req,res) {
    if(req.user) {
        res.redirect('/profile')
    } else {
        res.render('register')
    }
}

async function renderProfile(req,res) {
    const user = await usersService.getUserById(req.user.id)
    res.render('profile', {
        userId: user._id,
        user: {
            role: user.role,
            email: user.email,
            name: user.fullName.split(" ")[0],
            isAdmin: user.role === "ADMIN" ? true : false
        }
    })
}

async function renderForgotpassword(req,res) {
    res.render('forgotPassword')
}

async function renderUpdatePassword(req,res) {
    let isValid = true
    try {
        const userID = jwt.verify(req.params.token, process.env.SECRET_KEY).id
    } catch (error) {
        isValid = false
    }
    res.render('updatePassword', {
        isValid,
        token: req.params.token
    })
}

async function renderUpload(req,res) {
    res.render('upload', {
        userId: req.user.id
    })
}

async function renderManageUsers(req,res) {
    let users = await usersService.getAllFilteredUsers()
    res.render('manageUsers', {
        users: users
    })
}

async function renderManageSpecificUser(req,res) {
    let user = await usersService.getUserById(req.params.uid)
    if(!user) return res.sendUserError("No existe un usuario con ese ID")
    res.render('manageSpecificUser', {
        user: user
    })
}

async function renderCheckout(req,res) {
    let user = await usersService.getUserById(req.user.id)
    let cart = await cartsService.getPopulatedCartById(user.cart)
    let total = 0
    cart.products.forEach(prod => {
        total += prod.product.price
    })
    res.render('checkout', {
        cartID: user.cart,
        total: total
    })
}

export default {
    renderHome,
    renderChat,
    renderProducts,
    redirectToCart,
    renderCartFromParamsId,
    renderLogin,
    renderRegister,
    renderProfile,
    renderForgotpassword,
    renderUpdatePassword,
    renderUpload,
    renderManageUsers,
    renderManageSpecificUser,
    renderCheckout
}