'use client'

import React, { useContext, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useClerk, UserButton, useUser } from '@clerk/nextjs'
import { Button } from './ui/button'
import { ShoppingBagIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { UserContext } from '@/context/context'
import { CartIcon } from '@/assets/assets'
import { Input } from './ui/input'
import { Badge } from './ui/badge'


const Navbar = () => {
const router=useRouter()
  const {openSignIn}=useClerk()
  const {user,userdata}=useContext(UserContext)!
const {count}=useContext(UserContext)!
  console.log(user)

  

  return (
    <header className='w-full h-10  mt-4 '>
      <nav className=' flex justify-between w-full mx-auto h-full border items-center'>
        <div className='w-[10%]  flex items-center justify-center'>
          <h1 onClick={()=>router.push('/')} className='text-xl font-bold cursor-pointer'>KEN-KART</h1>
        </div>

       
        
       

        <div className='w-[70%]  '>

          <ul className='w-full h-full flex gap-15 justify-end  items-center p-4'>
            <Badge className='cursor-pointer hover:underline h-7 w-fit ' onClick={()=>router.push('/')}>Products</Badge>
            <Badge className='cursor-pointer hover:underline h-7'>offers</Badge>
            <Badge className='cursor-pointer hover:underline h-7'>about us</Badge>
             <Badge className='cursor-pointer hover:underline h-7' onClick={()=>router.push('/order')}>My Orders</Badge>
             {userdata?.role==="seller" && <Badge className='cursor-pointer hover:underline h-7' onClick={()=>router.push('/dashboard/seller')}>Seller Dashboard</Badge>}
              {userdata?.role==="admin" && <Badge className='cursor-pointer hover:underline h-7' onClick={()=>router.push('/dashboard/admin')}>Admin Dashboard</Badge>}
          </ul>

        </div>

        <div className='w-[10%]  flex items-center justify-center gap-6'>
          

          <div className='relative cursor-pointer ' onClick={()=>router.push('/cart')}>
                 <CartIcon />
                  <span className='flex items-center justify-center w-3 h-3 rounded-full bg-red-300 text-xs absolute -top-1 -right-2 '> {count ?? 0}</span>
                
               
          </div>
         


          

          {user ? <>
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label='Your Cart' labelIcon={<ShoppingBagIcon size={16}/>} onClick={()=>router.push('/cart')} />
            </UserButton.MenuItems>
          </UserButton>
          </> :
          <Button variant="secondary" className='cursor-pointer' onClick={()=>openSignIn()}>Login</Button>
}
        

        </div>
      </nav>
        
      
    </header>
  )
}

export default Navbar
