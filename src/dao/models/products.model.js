import mongoose from 'mongoose'
import mongoosePginate from 'mongoose-paginate-v2'
const productColection = 'products'

// Configuramos el modelo de prductos
const productSchema = new mongoose.Schema({
    title:{type:String, required: true},
    description:{type:String, required: true},
    code:{type:String, required: true, unique:true},
    price:{type:Number, required: true},
    status:{type:Boolean, required: true},
    stock:{type:Number, required: true},
    category:{type:String, required: true},
    thumbnail:{type:Array, requred:false, default: []}
})
productSchema.plugin(mongoosePginate)

const productModel = mongoose.model(productColection, productSchema)

export default productModel