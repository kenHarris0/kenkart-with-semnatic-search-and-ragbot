import Product from "@/models/product.model";
import { connectDB } from "../db";




export async function Getproduct(){

    try{
await connectDB()

    const products=await Product.find()

    return{
        success:true,
        product:JSON.parse(JSON.stringify(products))
    }
    }
    catch(err){
        console.log(err)
        return{
        success:false,
        message:"failed to fetch products"
    }
    }
    
}