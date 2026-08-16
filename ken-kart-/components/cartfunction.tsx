'use server'
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { auth } from "@clerk/nextjs/server";



export async function getCartCount() {
  await connectDB();

  const { userId } = await auth();

  if (!userId) return {
      cart: [],
      count: 0,
    };

  const user = await User.findOne({ clerkId: userId });
  if(!user){
    return{
      cart:[],
      count:0
    }
  }
  await user.populate("cartItems.product")

  return {
    cart:JSON.parse(JSON.stringify(user.cartItems)),
    count:user?.cartItems.length ?? 0
  }
}