import express from 'express'
import { router as productsRouter } from './routes/products.router.js'
import { router as cartsRouter } from './routes/carts.router.js'

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/", productsRouter)
app.use("/", cartsRouter)

app.listen(PORT ,() => {
    console.log(`server runing on port ${PORT}`)
})