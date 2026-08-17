'use client'

import { Field, FieldTitle } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

import Link from 'next/link'
import { IProduct } from '@/models/types'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from './ui/button'


const ProductClient = ({products}:{products:IProduct[]}) => {

    const [search,setsearch]=useState<string>("")

  const [filtereditems,setfiltered]=useState<string[] | null>(null)

    const handleSemanticSearch = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault()

  try {
    const res = await axios.post(
      "http://localhost:8000/search_product_embedding",
      { query: search }
    )

    console.log("SEARCH RESPONSE:", res.data)
    console.log("PRODUCT IDS:", res.data.results)

    if (res.data.success) {
      setfiltered(res.data.results)
    }
    else{
      setfiltered(null)
    }
  } catch (err) {
    console.log(err)
  }
}

  

const finalproducts: IProduct[] = filtereditems
  ? filtereditems.flatMap(id =>
  products.filter(product =>
    product._id?.toString() === id
  )
)
  : products 

  return (
    <>
     <div className="mb-10">
    <Field className="max-w-lg">
      <FieldTitle>Search Products</FieldTitle>
      <form onSubmit={handleSemanticSearch} className='flex items-between  gap-10'>
         <Input
        placeholder="Search..."
        className="rounded-lg"
        value={search}
        onChange={(e)=>setsearch(e.target.value)}
      />
      <Button type='submit' className='cursor-pointer'>Search</Button>

      </form>
     
    </Field>
  </div>

  {/* Products */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {finalproducts?.map((item:IProduct) => (
      <Link href={`/products/${item._id}`} key={item._id}>
        <Card
          
          className="overflow-hidden hover:shadow-lg  cursor-pointer hover:scale-110 transition-transform duration-400 ease-in-out"
          
        >
        <CardContent className="p-4 ">
          <div className="relative w-full h-48">
            <Image
              src={item.image[0]}
              alt={item.name}
              fill
              className="object-contain"
            />
          </div>

          <h3 className="mt-4 font-semibold text-lg">
            {item.name}
          </h3>

          <p className="text-muted-foreground">
            ${item.price}
          </p>
        </CardContent>
      </Card>
      </Link>
    ))}
  </div>
      
    </>
  )
}

export default ProductClient
