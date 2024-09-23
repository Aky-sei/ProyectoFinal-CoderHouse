import productsService from "../dao/services/products.service.js"
import usersService from "../dao/services/users.service.js"
import {generateProduct} from '../utils.js'
import nodemailer from 'nodemailer'

// Creamos las funciones necesarias para los productos
async function getAllProducts(req,res) {
    try {
        let { limit = 10, page = 1, sort, query = 0} = req.query
        const products = await productsService.getPaginatedProducts(req.query)
        query = encodeURIComponent(query).toString()
        res.sendSuccess({
            ...products,
            prevLink: page > 1 ? `/products?limit=${limit}&page=${parseInt(page) - 1}&sort=${sort || ''}&query=${query}` : null,
            nextLink: page < products.totalPages ? `/products?limit=${limit}&page=${parseInt(page) + 1}&sort=${sort || ''}&query=${query}` : null 
        })
    } catch (error) {
        res.sendServerError("Error al obtener los productos", error)
    }
}

async function getProductByParamsId(req,res) {
    try {
        const product = await productsService.getProductById(req.params.pid)
        if(product) {
            res.sendSuccess(product)
        } else {
            res.sendUserError("El producto no existe")
        }
    } catch (error) {
        res.sendServerError("Error al obtener el producto", error)
    }
}

async function postProduct(req,res) {
    try {
        const product = await productsService.postProduct({
            ...req.body,
            owner: req.user.id
        })
        res.sendSuccess(product)
    } catch (error) {
        res.sendServerError("Error al agregar el producto", error)
    }
}

async function putProductByParamsId(req,res) {
    try {
        if(req.user.role === "USER") return res.sendUserError("Permisos insuficientes para actualizar productos")
        if(req.user.role === "PREMIUM") {
            const oldProduct = await productsService.getProductById(req.params.id)
            if (oldProduct.owner !== req.user.id) return res.sendUserError("Imposible actualizar un porducto que no te pertenece")
        }
        const newProduct = await productsService.putProductById(req.params.pid, req.body)
        res.sendSuccess(newProduct)
    } catch (error) {
        res.sendServerError("Error al actualizar el producto", error)
    }
}

const transport = nodemailer.createTransport({
    service: 'gmail',
    port:587,
    auth:{
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
})

async function deleteProductByParamsId(req,res) {
    try {
        if(req.user.role === "USER") return res.sendUserError("Permisos insuficientes para eliminar productos")
        const oldProduct = await productsService.getProductById(req.params.pid)
        if(req.user.role === "PREMIUM") {
            if (oldProduct.owner !== req.user.id) return res.sendUserError("Imposible eliminar un porducto que no te pertenece")
        }
        const owner = await usersService.getUserById(oldProduct.owner)
        if(owner.role === "PREMIUM") {
            transport.sendMail({
                from: `CoderHouse ${process.env.GMAIL}`,
                to: user.email,
                subject: 'Producto Eliminado',
                html: `
                    <div>
                        <h1>Un prodcuto de su propiedad en CoderHouserExample.com a sido eliminado<h1/>
                        <p>Este correo es para informarle que un administrador ha eliminado un producto de su propiedad en CoderHouserExample.com<p/>
                        <p>El producto eliminado es ${oldProduct.title}<p/>
                    <div/>
                `
            })
        }
        const deletedProduct = await productsService.deleteProductById(req.params.pid)
        res.sendSuccess(deletedProduct)
    } catch (error) {
        res.sendServerError("Error al eliminar el producto", error)
    }
}

async function getRandomProducts(req,res) {
    try {
        let products = []
        for(let i=0;i<100;i++){
            products.push(generateProduct())
        }
        res.sendSuccess(products)
    } catch (error) {
        res.sendServerError("Error al generar los productos", error)
    }
}

// Exportamos las funciones necesarias
export default {
    getAllProducts,
    getProductByParamsId,
    postProduct,
    putProductByParamsId,
    deleteProductByParamsId,
    getRandomProducts
}