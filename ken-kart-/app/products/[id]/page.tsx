

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { connectDB } from '@/lib/db'
import Product from '@/models/product.model'

import Image from 'next/image'

import { IProduct } from '@/models/types'
import Addtocart from '@/components/addtocart'
import { auth } from '@clerk/nextjs/server'
import User from '@/models/user.model'


export default async function Productpage({params}:{params:Promise<{id:string}>}) {

  const {id}=await params

  await connectDB()
  const currproduct:IProduct | null =await Product.findById(id)

  if (!currproduct) {
  return <div>Product not found</div>
}
const {userId}=await auth()
const curruser=await User.findOne({clerkId:userId})

const cartItem = curruser?.cartItems.find(
  (item: {product:string,quantity:number}) => item.product.toString() === id
);

const currquantity = cartItem?.quantity ?? 0;
 
  return (
    <div className='w-full h-full overflow-y-hidden  flex border p-5 gap-2'>

      <div className="w-[40%] h-150  shadow-lg rounded-lg border-gray-400/90 mt-10">
        <Card className='  h-full flex flex-col'>
          <CardContent className=' relative p-6 flex-1'>
            <Image src={currproduct?.image[0]} alt={currproduct.name} fill className='rounded-lg border' />
          </CardContent>
          <CardFooter className='border-t border-gray-700/30 h-20 shrink-0'>
            <h1 className='font-extrabold text-2xl '>{currproduct.name}</h1>
          </CardFooter>
        </Card>
      

      </div>

      <div className="w-[60%] h-180  rounded-xl border border-gray-300 shadow-lg p-8 flex flex-col gap-6">

  <div className=''>
    <h1 className="text-4xl font-bold">
      {currproduct.name}
    </h1>

    <p className="mt-2 text-gray-500">
      {currproduct.category}
    </p>
  </div>

  

  <div className="flex items-center gap-4">
    <h2 className="text-4xl font-bold text-green-600">
      ₹{currproduct.offerPrice}
    </h2>

    <p className="text-xl text-gray-400 line-through">
      ₹{currproduct.price}
    </p>

    <span className="rounded bg-green-100 px-3 py-1 text-green-700 font-semibold">
      {Math.round(
        ((currproduct.price - currproduct.offerPrice) /
          currproduct.price) *
          100
      )}
      % OFF
    </span>
  </div>

  <div className="border-t pt-5">
    <h3 className="text-xl font-semibold mb-2">
      Description
    </h3>

    <p className="leading-7 text-gray-600">
      {currproduct.description}
    </p>
  </div>

  <Addtocart  productId={id} initialQuantity={currquantity}/>

  

</div>
      
    </div>
  )
}

