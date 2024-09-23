import { Router } from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import usersService from '../dao/services/users.service.js'

// Creamos el custom router
export default class CustomRouter{
    constructor() {
        this.router = Router()
        this.init()
    }

    getRouter() {
        return this.router
    }

    init(){}

    // Definimos los metodos de CRUD, incluyendo los middlewares que querremos siempre
    get(path,policies,...callbacks) {
        this.router.get(path,this.handlePolicies(policies),this.applyCallbacks(callbacks))
    }
    post(path,policies,...callbacks) {
        this.router.post(path,this.handlePolicies(policies),this.applyCallbacks(callbacks))
    }
    put(path,policies,...callbacks) {
        this.router.put(path,this.handlePolicies(policies),this.applyCallbacks(callbacks))
    }
    delete(path,policies,...callbacks) {
        this.router.delete(path,this.handlePolicies(policies),this.applyCallbacks(callbacks))
    }

    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async(...params) => {
            try {
                await callback.apply(this,params)
            } catch (error) {
                params[1].sendServerError("Error interno del router", error)
            }
        })
    }

    // Manejamos los accesos de los usuarios con jwt
    handlePolicies = policies => async (req,res,next) => {
        if(policies[0] === "PUBLIC") {
            const authHeaders = req.cookies.coderCookieToken || null
            if (!authHeaders) return next()
            const token = authHeaders.split(" ")[1]
            const userId = jwt.verify(token, process.env.SECRET_KEY)    
            const user = await usersService.getUserById(userId.id)
            req.user = {
                id: JSON.stringify(user._id).replace(/^.(.*).$/, '$1'),
                cart: user.cart,
                role: user.role.toUpperCase()
            }
            return next()
        }
        const authHeaders = req.cookies.coderCookieToken || null
        if (!authHeaders) return res.status(401).send({status: "error", error: "Unauthorized"})
        const token = authHeaders.split(" ")[1]
        const userId = jwt.verify(token, process.env.SECRET_KEY)    
        const user = await usersService.getUserById(userId.id)
        if(!policies.includes(user.role.toUpperCase())) return res.status(403).send({status: "error", error: "Unauthorized"})
        req.user = {
            id: JSON.stringify(user._id).replace(/^.(.*).$/, '$1'),
            cart: user.cart,
            role: user.role.toUpperCase()
        }
        next()
    }
}