'use client'
import React, { useContext, useState } from 'react'
import { Button } from './ui/button'
import { addtocartfunc } from '@/lib/actions/addtocart'
import { removeFromCart } from '@/lib/actions/removefromcart'
import { UserContext } from '@/context/context'

interface Addtocartinterface{
    productId:string,
    initialQuantity:number
}


const Addtocart = (props:Addtocartinterface) => {

    const [quantity,setquantity]=useState<number>(props.initialQuantity)
const [loading, setLoading] = useState(false);

const {count,setcount,cart,setcart}=useContext(UserContext)!


    async function additem(){
      setLoading(true)
      try{
       
        const res=await addtocartfunc(props.productId)

        if(res?.success){
          setquantity(res.quantity ?? 0)
          setcount(res.total ?? 0)
          setcart(res.cartitem)
        }


      }
      catch(err){
        console.log(err)
      }
      finally{
        setLoading(false)
      }
    }


    async function dropitem(){
      setLoading(true)
      try{
       
        const res=await removeFromCart(props.productId)

        if(res?.success){
          setquantity(res.quantity ?? 0)
          setcount(res.total ?? 0)
           setcart(res.cartitem)
        }


      }
      catch(err){
        console.log(err)
      }
      finally{
        setLoading(false)
      }
    }





    

  return (
    <div className='w-full h-50 flex flex-col border p-5  justify-center'>

<div className="flex items-center gap-1 mt-4">

  <button
    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-xl font-bold transition hover:bg-gray-100"
     onClick={dropitem} disabled={loading}
  >
    -
  </button>

  <p className="w-10 text-center text-lg font-semibold">
    {quantity}
  </p>

  <button
    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-xl font-bold transition hover:bg-gray-100"
    onClick={additem} disabled={loading}
  >
    +
  </button>

</div>



{/*button feature*/}

<div className="mt-auto flex gap-4">
    <Button size="lg" className='w-1/2 h-12 text-xl' onClick={additem} disabled={loading}>
      Add to Cart
    </Button>

     <Button size="lg" className='w-1/2 h-12 text-xl' variant="destructive">
      Buy Now
    </Button>
  </div>
      
    </div>
  )
}

export default Addtocart
