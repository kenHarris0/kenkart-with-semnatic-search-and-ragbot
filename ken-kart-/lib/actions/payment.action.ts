"use server";

import { razorpay } from "@/lib/razorpay";

export async function createPayment(total: number) {

    const order = await razorpay.orders.create({

        amount: total * 100,

        currency: "INR",

    });

    return order;
}