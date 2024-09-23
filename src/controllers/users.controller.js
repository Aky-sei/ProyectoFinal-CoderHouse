import usersService from "../dao/services/users.service.js"
import { __dirname } from '../utils.js'
import nodemailer from 'nodemailer'
import 'dotenv/config'

async function changeUserRole(req,res) {
    try {
        const user = await usersService.getUserById(req.params.uid)
        if (!user) return res.sendUserError("No se encuentrs un usuario con ese ID")
        if (req.user.id != user._id) return res.sendUserError("No se puede alterar el estado de otro usuario")
        if (req.user.role === "USER") {
            if (user.documents.length < 3) return res.sendUserError("Para poder subir de rol, debe enviar los archivos necesarios")
            const logedUser = await usersService.putUserById(req.params.uid, {
                ...user,
                role: "PREMIUM"
            })
            return res.sendSuccess(logedUser)
        }
        const logedUser = await usersService.putUserById(req.params.uid, {
            ...user,
            role: "USER"
        })
        return res.sendSuccess(logedUser)
    } catch (error) {
        res.sendServerError("Error al cambiar el rol del usuario", error)
    }
}

async function uploadFileToUser(req,res) {
    try {
        if(!req.files) return res.sendUserError("Error al subir el archivo")
        let user = await usersService.getUserById(req.params.uid)
        if(!user) return res.sendUserError("No hay ningun usuario con ese ID")
        req.files.forEach(doc => {
            user.documents.push({
                name: doc.originalname,
                reference: __dirname+`/public/docs/`+req.params.uid+"--"+doc.originalname
            })
        })
        let newUser = await usersService.putUserById(req.params.uid, user)
        res.sendSuccess(newUser)
    } catch (error) {
        res.sendServerError("Error al subir el archivo", error)
    }
}

async function getAllFilteredUsers(req,res) {
    try {
        let users = await usersService.getAllFilteredUsers()
        if (!users) return res.sendUserError("No se encontró ningun usuario")
        res.sendSuccess(users) 
    } catch (error) {
        res.sendServerError("Error al obtener los usuarios", error)
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

async function deleteInactiveUsers(req,res) {
    try {
        let users = await usersService.getAllUsers()
        users.forEach(user => { 
            let diference = 30*(24*60*60*1000) // 30 dias  en milisegundos
            if(user.last_connection) {
                let date = new Date()
                diference = date.getTime() - user.last_connection.getTime()
            }
            if(diference >= 30*(24*60*60*1000)) {
                transport.sendMail({
                    from: `CoderHouse ${process.env.GMAIL}`,
                    to: user.email,
                    subject: 'Cuenta eliminada',
                    html: `
                        <div>
                            <h1>Le informamos que su cuenta de CoderHouseExample.com ha sido eliminada debido a inactividad.<h1/>
                            <p>Puede volver a crear una cuenta ingresando nuevamente a la pagina. <a href="${process.env.HOST}">Aqui</a><p/>
                        <div/>
                    `
                    })
                usersService.deleteUserById(user._id)
            }
        })
        return res.sendSuccess("Usuarios eliminados")
    } catch (error) {
        res.sendServerError("Error al eliminar los usuarios inactivos", error)
    }
}

async function updateUser(req,res) {
    try {
        let user = await usersService.getUserById(req.params.uid)
        if(!user) return res.sendUserError("No existe un usuario con ese ID") 
        user = {
            ...user,
            ...req.body
        }
        let updatedUser = await usersService.putUserById(req.params.uid,user)
        res.sendSuccess(updatedUser)
    } catch (error) {
        res.sendServerError("Error al actualizar al usuario", error)
    }
} 

async function deleteUser(req,res) {
    try {
        let deletedUser = await usersService.deleteUserById(req.params.uid)
        res.sendSuccess(deletedUser)
    } catch (error) {
        res.sendServerError("Error al eliminar el usuario", erro)
    }
}

export default {
    changeUserRole,
    uploadFileToUser,
    getAllFilteredUsers,
    deleteInactiveUsers,
    updateUser,
    deleteUser
}