

import {productsDummyData} from '@/assets/assets'
import { Field, FieldTitle } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'



import { connectDB } from '@/lib/db'
import Product from '@/models/product.model'
import Link from 'next/link'
import ProductClient from '@/components/ProductClient'

export default async function Products() {


await connectDB()

const products=await Product.find()










  return (
    <div className="w-full px-8 py-8 ">
  
  <ProductClient products={JSON.parse(JSON.stringify(products))}/>
 
</div>
  )
}

