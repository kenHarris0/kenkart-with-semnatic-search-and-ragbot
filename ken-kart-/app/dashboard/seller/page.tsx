import Selleradd from "@/components/selleradd"
import { Button } from "@/components/ui/button"
import RemovesellerProduct from "@/lib/actions/removesellerproduct"
import { connectDB } from "@/lib/db"
import Product from "@/models/product.model"
import { IProduct } from "@/models/types"
import User from "@/models/user.model"
import { auth } from "@clerk/nextjs/server"
import { Dialog } from "radix-ui"








export default async function SellerDashboard(){

    await connectDB()
    const {userId}=await auth()
    if(!userId){
        return <>Cant fetch seller dashboard</>
    }

    const user=await User.findOne({clerkId:userId})
     if(!user){
        return <>Cant fetch seller dashboard</>
    }

    if(user?.role!=="seller"){
    return <>You dont have access, only seller accounts can access this page</>
}

console.log("User ID:", user._id);

const allProducts = await Product.find({
  sellerId: user._id,
});

console.log("Products:", allProducts);






    return(
        <div className="w-full h-screen flex flex-col gap-2  p-3">
            <Selleradd allProducts={JSON.parse(JSON.stringify(allProducts))} role={user.role}/>

           

        </div>
    )





}