'use server'
import Product from "@/models/product.model"
import User from "@/models/user.model"
import { auth } from "@clerk/nextjs/server"





export async function removeFromCart(productId:string){

    try{

        const {userId}=await auth()
        if(!userId){
            throw new Error("unauthorized")
        }
        const user=await User.findOne({clerkId:userId})
         if(!user){
            throw new Error("no user found")
        }

        const product=await Product.findById(productId)
         if(!product){
            throw new Error("no product found")
        }

        const exisitngItem=user.cartItems.find((item:{product:string,quantity:number})=>item.product.toString()===productId)

        if(!exisitngItem){
            return{
                success:false,
                message:"no such items found to remove"
            }
        }

        if(exisitngItem.quantity>1){
            exisitngItem.quantity-=1
        }
        else{
            user.cartItems=user.cartItems.filter((item:{product:string,quantity:number})=>item.product.toString()!==productId)
        }

        await user.save()



        const itemm=user.cartItems.find((item:{product:string,quantity:number})=>item.product.toString()===productId)
        console.log(itemm)
await user.populate("cartItems.product");
        return {
            success:true,
            quantity:itemm?.quantity ?? 0,
            total:user.cartItems.length ?? 0,
            cartitem:JSON.parse(JSON.stringify(user.cartItems))
        }
        


        




    }
    catch(err){
        console.log(err)
    }

}