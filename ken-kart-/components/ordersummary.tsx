'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Card,CardContent ,CardTitle,CardHeader} from './ui/card'
import { Button } from './ui/button'
import { UserContext } from '@/context/context'
import { createPayment } from '@/lib/actions/payment.action'
import Script from "next/script";
import { Car } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Field } from './ui/field'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Addaddress } from '@/lib/actions/addaddress'
import { VerifyPayment } from '@/lib/actions/verifypayment'
import { useRouter } from 'next/navigation'


const Ordersummary = () => {
const router=useRouter()
    const {cart,setcart,userdata,setuserdata}=useContext(UserContext)!
const totalAmount = Math.round(cart.reduce(
  (total, item) => total + item.product.offerPrice * item.quantity,
  0
))


const handleCheckout = async () => {
    try {
        const order = await createPayment(totalAmount);

        console.log(order);

        

        const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
    amount: order.amount,
    currency: order.currency,
    order_id: order.id,

    handler: async (response: any) => {
    const result = await VerifyPayment({
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
    });
     if (result.success) {
    // Clear local context if needed
    // router.push("/orders/success");
    setcart([])
    router.push('/order/success')

  }
  else{
    router.push('/order/failed')
  }

    
}
};

const razorpay = new (window as any).Razorpay(options);
razorpay.open();

    } catch (err) {
        console.log(err);
    }
};

const [address,setaddress]=useState<string>(userdata?.shippingAddress ?? "")

// add address to user

const submitAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        const res = await Addaddress(address);

        if (res?.success) {
          setuserdata(res.user)
            alert("Address added");
        }
    } catch (err) {
        console.log(err);
    }
};
console.log(address)

  return (
    <>
     <Script src="https://checkout.razorpay.com/v1/checkout.js" />

    
    <Card className="w-full border h-fit">
  <CardHeader className="border-b">
    <CardTitle className="text-xl">Order Summary</CardTitle>
  </CardHeader>

  <CardContent className="p-5 space-y-5">

    <div className="flex items-center justify-between border-b pb-4">
      <h2 className="text-muted-foreground">Subtotal</h2>
      <p className="font-semibold">${totalAmount || 0}</p>
    </div>

    <div className="flex justify-between gap-6 border-b pb-4">
      <h2 className="text-muted-foreground whitespace-nowrap">
        Shipping
      </h2>
<div className='flex flex-col gap-3'>
<div className="text-right text-sm text-muted-foreground">
       {!userdata?.shippingAddress ? <p> Free shipping. Shipping options will be updated during checkout.</p> : <>{userdata?.shippingAddress}</>}
      </div>

     <span className='flex w-full  items-center justify-end p-1  gap-4'><Car/> 
    <Dialog>
  <DialogTrigger asChild>
    <Button variant="secondary">{userdata?.shippingAddress ? "Change Address": "Add Address"}</Button>
  </DialogTrigger>

  <DialogContent>
    <form onSubmit={submitAddress} className='flex flex-col gap-4' >
      <DialogHeader>
        <DialogTitle>Add Shipping Address</DialogTitle>
      </DialogHeader>

      <Field>
        <Label htmlFor="address" className=''>Address</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setaddress(e.target.value)}
        />
      </Field>

      <DialogFooter className=''>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>

        <Button type="submit">Save Changes</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
     
     </span>
</div>
      
    </div>

    <div className="flex items-center justify-between border-b pb-4">
      <h2 className="text-lg font-semibold">Total</h2>
      <p className="text-lg font-bold">${totalAmount || 0}</p>
    </div>

    <Button size="lg" className="w-full" onClick={handleCheckout}>
      Checkout
    </Button>

  </CardContent>
</Card> 
</>
  )
}

export default Ordersummary
