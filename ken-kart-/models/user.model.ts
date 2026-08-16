import mongoose from 'mongoose'


import {IUser} from './types'


const userSchema=new mongoose.Schema<IUser>({
    clerkId:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true
    },
    cartItems:[
        {
            product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"product",
        },
        quantity:{
            type:Number,
            default:1,
            min:1
        }
            
        }
    ],
    shippingAddress:{
        type:String,
        default:""

    },
    role:{
        type:String,
        enum:["user","admin","seller"],
        default:"user"
    }
},{minimize:false})


const User=mongoose.models.user || mongoose.model<IUser>('user',userSchema)

export default User