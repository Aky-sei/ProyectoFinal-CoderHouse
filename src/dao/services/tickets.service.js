import ticketsModel from "../models/tickets.model.js"

async function postTicket(ticket) {
    const { code,purchase_datetime,amount,purchaser} = ticket
    if (!code || !purchase_datetime || !amount || !purchaser) throw new Error("Por favor, llenas todos los campos")
    const newTicket = await ticketsModel.create({
        code,
        purchase_datetime,
        amount,
        purchaser
    })
    return newTicket
}

export default {
    postTicket
}