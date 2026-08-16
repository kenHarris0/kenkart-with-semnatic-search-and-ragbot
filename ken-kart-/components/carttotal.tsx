'use client'


import { IProduct } from '@/models/types'
import React from 'react'




const Carttotal = (props:{quantity:number,product:IProduct}) => {
    const lineTotal = props.quantity * props.product.offerPrice;
  return (
    <div className='w-full h-full flex items-center justify-center'>

        <p className='text-muted-foreground font-semibold text-sm'>${props.product.offerPrice} x {props.quantity} = {lineTotal}</p>
      
    </div>
  )
}

export default Carttotal
