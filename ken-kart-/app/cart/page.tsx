
import { Field, FieldDescription, FieldTitle } from '@/components/ui/field'
import { connectDB } from '@/lib/db'
import { IProduct } from '@/models/types'
import User from '@/models/user.model'
import { auth } from '@clerk/nextjs/server'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

import Cartitem from '@/components/cartitem'

import Ordersummary from '@/components/ordersummary'




const Cartpage = async() => {

  await connectDB()

  const {userId}=await auth()

  const user=await User.findOne({clerkId:userId}).populate({
    path:"cartItems",
    populate:{
      path:"product"
    }
  }).lean()

  const Usercartitems=user.cartItems || []

console.log(Usercartitems)

    


  return (
    <div className='w-full min-h-screen flex flex-col '>

      <Field className=' border-b p-4 mt-10' >
        <FieldTitle className=' text-2xl'>{user?.name || "User"} CART</FieldTitle>
        <FieldDescription className=' text-lg'>All the items that you have added for checkout.</FieldDescription>
      </Field>

<div className='  w-full h-full flex justify-center gap-4 p-4'>

      <div className=' w-3/4 h-150 flex flex-col gap-2  overflow-y-hidden'>
        {Usercartitems?.map((item:{product:IProduct,quantity:number},ind:number)=>{
          return(
            <div key={ind} className='w-full h-30 border flex gap-7'>

              <Image src={item.product.image[0]} alt={item.product.name}  width={120} height={100} className='p-1'/>

              <div className='flex flex-col  w-50 justify-center items-center gap-4 p-3'>
                <Badge>
                  Price
                </Badge>
                <div className='w-full flex gap-2 items-center'>
<span className='inline-block w-fit h-10 bg-green-400 p-2 rounded-xl font-bold '>${item.product.offerPrice}</span>
                <p className='line-through i '>${item.product.price}</p>
                </div>

          </div>

          <div className='flex flex-col  w-50 justify-center items-center gap-4 p-3'>
                <Badge variant="default" className='bg-green-700/80'>
                  Category
                </Badge>
              <p className='font-bold text-base '> {item.product.category}</p> 
                
                </div>

                {/*quantity handling*/}

                <div className='flex flex-col  w-100 justify-center items-center gap-4 p-3'>
                <Badge variant="default" className='bg-green-700/80'>
                  Quantity
                </Badge>
             
       <Cartitem quanty={item.quantity} product={JSON.parse(JSON.stringify(item.product))}/>
                
                </div>

             


           



            </div>

          )
        })}

      </div>

  <div className='w-1/4 '>
<Ordersummary/>
  </div>



  </div>

  
  


       
    </div>
  )
}

export default Cartpage
