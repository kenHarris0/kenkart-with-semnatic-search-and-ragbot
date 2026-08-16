
'use client'
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { createContext } from 'react'
import axios from 'axios'
import { Dispatch, SetStateAction } from "react";
import { getCartCount } from '@/components/cartfunction'
import { IProduct, IUser } from '@/models/types'

type CartItem = {
  product: IProduct;
  quantity: number;
};


type contextType={
    user:ReturnType<typeof useUser>["user"],
    count:number,
    setcount: Dispatch<SetStateAction<number>>,
    cart:CartItem[],
    setcart:Dispatch<SetStateAction<CartItem[]>>,
    userdata:IUser | null,
    setuserdata: Dispatch<SetStateAction<IUser | null>>;
}

export const UserContext=createContext<contextType | null>(null)

export default function context({children}:{children:React.ReactNode}) {
    const url="http://localhost:3000"

    const {user,isLoaded,isSignedIn}=useUser()
const [cart,setcart]=useState<CartItem[]>([])

const [userdata,setuserdata]=useState<IUser | null>(null)

  useEffect(() => {

    console.log("Effect", { isLoaded, isSignedIn });
  async function syncUser() {
    try {
      const res=await axios.post("/api/user/syncuser");
      if(res.data.success){
          setuserdata(res.data.user)
          
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (isLoaded && isSignedIn) {
    syncUser();
  }
}, [isLoaded, isSignedIn]);

const [count,setcount]=useState<number>(0)

useEffect(()=>{
  async function getcount(){
    const cartcount=await getCartCount()
    setcount(cartcount?.count ?? 0)
    setcart(cartcount.cart)

  }

  getcount()
},[])

const [product,setproduct]=useState<IProduct[]>([])









let value={
    user,
    count,
    setcount,
    cart,
    setcart,
    userdata,setuserdata

}


  return (
    <div>



        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
      
    </div>
  )
}


