'use client'

import { UserContext } from '@/context/context';
import { addtocartfunc } from '@/lib/actions/addtocart';
import { removeFromCart } from '@/lib/actions/removefromcart';
import { IProduct } from '@/models/types';
import React, { useContext, useState } from 'react'
import Carttotal from './carttotal';
import { useRouter } from "next/navigation";

interface IItem{
    quanty:number,
    product:IProduct
}

const Cartitem = (props:IItem) => {
  const router = useRouter();
 const [quantity,setquantity]=useState<number>(props.quanty)
const [loading, setLoading] = useState(false);

const {count,setcount,setcart}=useContext(UserContext)!


    async function additem(){
      setLoading(true)
      try{
       
        const res=await addtocartfunc(props.product._id!)

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
       
        const res=await removeFromCart(props.product._id!)
        router.refresh();

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
    <div className='w-full h-full flex   p-1  justify-between items-center'>

<div className="flex items-center gap-1 mt-2 justify-center">

  <button
    className="flex h-10 w-10 items-center justify-center rounded-lg border bg-red-300 border-gray-300 text-xl font-bold transition  hover:bg-gray-100"
     onClick={dropitem} disabled={loading}
  >
    -
  </button>

  <p className="w-10 text-center text-lg font-semibold">
    {quantity}
  </p>

  <button
    className="flex h-10 w-10 items-center justify-center rounded-lg border bg-green-300 border-gray-300 text-xl font-bold transition hover:bg-gray-100"
    onClick={additem} disabled={loading}
  >
    +
  </button>

</div>

<Carttotal quantity={quantity} product={props.product}/>

      
    </div>
  )
}

export default Cartitem
