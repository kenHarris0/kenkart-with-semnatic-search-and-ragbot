

'use server'

import { auth } from "@clerk/nextjs/server"
import { connectDB } from "../db"
import User from "@/models/user.model"
import Product from "@/models/product.model"
import Cloudinary from "../cloudinary"



export default async function AddsellerProduct(fdata:FormData){
    try{
    await connectDB()

    const {userId}=await auth()
    if(!userId){
        return{
            success:false,
            
        }
    }


    const user=await User.findOne({clerkId:userId})
 if(!user){
        return{
            success:false,
            
        }
    }


    const newImg=fdata.get("image") as string
    let newwimg:string | undefined="";
    if(newImg){
        const res=await Cloudinary.uploader.upload(newImg)
        if(res?.secure_url){
            newwimg=res.secure_url
        }
        else{
            return{
                success:false,
                mesage:"cloudinary error"
            }
        }
    }
console.log("Creating product with sellerId:", user._id);
 const product=  await Product.create({
  name: fdata.get("name") as string,
  description: fdata.get("description") as string,
  price: Number(fdata.get("price")),
  offerPrice: Number(fdata.get("offerPrice")),
  category: fdata.get("category") as string,
  image: [newwimg],
  sellerId:user._id
});
console.log(product);

const allSellerproduct=await Product.find({sellerId:user._id})

return {
    success:true,
    products:JSON.parse(JSON.stringify(allSellerproduct))

}
    }
    catch(err){
        console.log(err)
        return{
            success:false
        }
    }
}