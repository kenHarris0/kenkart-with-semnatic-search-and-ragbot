import mongoose from 'mongoose'

import {IProduct} from './types'




const userSchema=new mongoose.Schema<IProduct>({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        
    },
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        
    },
    price:{
        type:Number,
        default:0
    },
    offerPrice:{
        type:Number,
        default:0
    },
    image:{
        type:[String],
        default:[]
        
    },
    category:{
        type:String,
        
    },
    sellerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        
    }
},{minimize:false})


const Product=mongoose.models.product || mongoose.model<IProduct>('product',userSchema)

export default Product