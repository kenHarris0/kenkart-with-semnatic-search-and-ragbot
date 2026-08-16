'use server'

import { auth } from "@clerk/nextjs/server";
import { connectDB } from "../db";
import User from "@/models/user.model";
import crypto from "crypto"
import Order from "@/models/order.model";
interface VerifyPaymentProps {
  paymentId: string;
  orderId: string;
  signature: string;
}

export async function VerifyPayment({paymentId,orderId,signature}:VerifyPaymentProps){
    try{
        await connectDB()

          const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

        // Get user with populated cart
    const user = await User.findOne({
      clerkId: userId,
    }).populate("cartItems.product");

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }


    const body=`${orderId}|${paymentId}`
    const expectedSignature=crypto.createHmac("sha256",process.env.TEST_KEY_SECRET!).update(body)
      .digest("hex");

     if (expectedSignature !== signature) {
      return {
        success: false,
        message: "Payment verification failed",
      };
    }
const total = user.cartItems.reduce(
      (sum: number, item: any) =>
        sum + item.product.offerPrice * item.quantity,
      0
    );

    await Order.create({
  user: user._id,

  products: user.cartItems,

  shippingAddress: user.shippingAddress,

  totalAmount: total,

  paymentId,

  razorpayOrderId: orderId,

  paymentStatus: "Paid",

  orderStatus: "Confirmed",
});


user.cartItems = [];

await user.save();

return {
  success: true,
  message: "Payment verified successfully",
};

    }
    catch(err){
        console.log(err)
        return {
  success: false,
  message: "Payment verification failed",
};
    }
}
